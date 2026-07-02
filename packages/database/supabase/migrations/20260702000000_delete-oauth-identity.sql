-- Removing a Google/Azure login in the app deletes only the app-side
-- "userIdentity" row; GoTrue keeps its own auth.identities row. That leaves the
-- OAuth account still linked in GoTrue, so re-linking the same Google/Azure
-- account later fails with identity_already_exists ("Identity is already linked
-- to another user"). This helper lets the server (service_role) also drop the
-- GoTrue OAuth identity so unlink is clean and re-linking works.
--
-- SECURITY DEFINER because auth.identities is owned by the auth admin role and
-- is not reachable through PostgREST. search_path is pinned and every object is
-- fully qualified.

create or replace function public.delete_oauth_identity(
  p_user_id uuid,
  p_provider text,
  p_email text
) returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_deleted integer;
begin
  delete from auth.identities
  where user_id = p_user_id
    and provider = p_provider
    and identity_data->>'email' = p_email;
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.delete_oauth_identity(uuid, text, text) from public;
grant execute on function public.delete_oauth_identity(uuid, text, text) to service_role;
