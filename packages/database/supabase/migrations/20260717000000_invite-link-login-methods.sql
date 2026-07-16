-- An invite link can require an ordered list of login methods the joiner must
-- complete before they can request to join (e.g. ['wechat','phone'] = sign in
-- with WeChat, then link a phone). NULL/empty means any enabled method is fine.
-- Values are the userIdentity login-method types: email, google, azure, wechat, phone.
ALTER TABLE "inviteLink" ADD COLUMN "loginMethods" TEXT[];
