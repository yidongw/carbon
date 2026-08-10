-- Create the `notification` table, the one piece of live schema the shipped app
-- depends on that no committed migration provides.
--
-- History: created by 20260508120001_notifications.sql, later dropped, then
-- re-created by hand on the dev database (never re-committed). The ERP app reads
-- it directly (apps/erp/app/hooks/useNotifications.tsx and ~15 other files), so a
-- database built purely from committed migrations (staging, prod, fresh local) is
-- missing it. This restores it, matching the definition currently on dev.
--
-- (The earlier version of this migration also propagated large amounts of
-- unshipped dev drift — a global soft-delete feature and an unfinished bundle
-- rebuild — which we deliberately do NOT ship. See the drift-cleanup migration.)

DO $$
BEGIN
  IF to_regclass('public.notification') IS NULL THEN
    CREATE TABLE public.notification (
        id text DEFAULT public.xid() NOT NULL,
        "userId" text NOT NULL,
        "companyId" text NOT NULL,
        topic text NOT NULL,
        event text NOT NULL,
        title text NOT NULL,
        description text,
        "from" text,
        "documentType" text,
        "documentId" text,
        payload jsonb DEFAULT '{}'::jsonb NOT NULL,
        "readAt" timestamp with time zone,
        "seenAt" timestamp with time zone,
        "digestedInto" text,
        "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT notification_pkey PRIMARY KEY (id),
        CONSTRAINT "notification_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.company(id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT "notification_digestedInto_fkey" FOREIGN KEY ("digestedInto") REFERENCES public.notification(id) ON DELETE SET NULL
    );

    CREATE INDEX notification_user_company_created_idx ON public.notification USING btree ("userId", "companyId", "createdAt" DESC);
    CREATE INDEX notification_user_unread_idx ON public.notification USING btree ("userId", "companyId", topic) WHERE (("readAt" IS NULL) AND ("digestedInto" IS NULL));

    ALTER TABLE public.notification ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "SELECT" ON public.notification FOR SELECT USING (("userId" = (auth.uid())::text));
    CREATE POLICY "UPDATE" ON public.notification FOR UPDATE USING (("userId" = (auth.uid())::text));
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
