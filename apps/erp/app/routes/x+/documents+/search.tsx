import { requirePermissions } from "@carbon/auth/auth.server";
import { ResizablePanel, ResizablePanelGroup, VStack } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import type { Document } from "~/modules/documents";
import {
  DocumentsTable,
  getDocumentExtensions,
  getDocumentLabels,
  getDocuments
} from "~/modules/documents";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    view: "documents"
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const filter = searchParams.get("q");

  const createdBy = filter === "my" ? userId : undefined;
  const favorite = filter === "starred" ? true : undefined;
  const recent = filter === "recent" ? true : undefined;
  const active = filter === "trash" ? false : true;

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [labels, extensions] = await Promise.all([
    getDocumentLabels(client, userId),
    getDocumentExtensions(client)
  ]);

  const documents = getDocuments(client, companyId, {
    search,
    favorite,
    recent,
    createdBy,
    active,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    documents,
    labels: labels.data ?? [],
    extensions: extensions.data?.map(({ extension }) => extension) ?? []
  };
}

export default function DocumentsAllRoute() {
  const { documents, labels, extensions } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full ">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <Suspense fallback={<TableSkeleton />}>
            <Await
              resolve={documents}
              errorElement={
                <div className="p-4 text-sm text-red-500">
                  <Trans>Failed to load documents.</Trans>
                </div>
              }
            >
              {(documents) => (
                <DocumentsTable
                  data={(documents.data ?? []) as Document[]}
                  count={documents.count ?? 0}
                  labels={labels}
                  extensions={extensions}
                />
              )}
            </Await>
          </Suspense>
        </ResizablePanel>
        <Outlet />
      </ResizablePanelGroup>
    </VStack>
  );
}
