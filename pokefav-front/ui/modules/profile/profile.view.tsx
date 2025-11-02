"use client";

import { useState } from "react";
import type { ProfileViewProps } from "./profile.container";
import { Typography } from "@/ui/design-system/typography/typography";
import Button from "@/ui/design-system/button/button";

export function ProfileView(props: ProfileViewProps) {
  const {
    displayName,
    email,
    onRequestPasswordReset,
    onDeleteAccount,
    loadingReset,
    loadingDelete,
    errorMessage,
    successMessage,
  } = props;

  const [confirmText, setConfirmText] = useState("");

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Identité */}
      <section className="bg-white rounded-xl shadow-sm border border-zinc-200/60 p-6">
        <div className="flex items-center gap-4">
          <div>
            <Typography variant="h3">{displayName}</Typography>
            <Typography variant="body-sm" className="text-zinc-500">
              {email}
            </Typography>
          </div>
        </div>
      </section>

      {/* Sécurité */}
      <section className="bg-white rounded-xl shadow-sm border border-zinc-200/60 p-6 space-y-4">
        <Typography variant="h4">Security</Typography>
        <div className="flex flex-col gap-2">
          <Typography variant="body-base">
            You can receive an email to change your password.
          </Typography>
          <div>
            <Button
              size="medium"
              disabled={loadingReset}
              action={onRequestPasswordReset}
            >
              {loadingReset ? "Sending…" : "Send password reset email"}
            </Button>
          </div>
          <Typography variant="body-sm" className="text-zinc-500">
            A link will be sent to your address. You can also use the
            &quot;Forgot password&quot; page.
          </Typography>
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-white rounded-xl shadow-sm border border-red-200/60 p-6 space-y-4">
        <Typography variant="h4" className="text-red-600">
          Danger zone
        </Typography>
        <Typography variant="body-base">
          Deleting your account is irreversible. Type your exact display name to
          confirm.
        </Typography>
        <input
          type="text"
          className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-red-500"
          placeholder={displayName}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />
        <div>
          <Button
            variant="danger"
            size="medium"
            disabled={loadingDelete}
            action={() => onDeleteAccount(confirmText)}
          >
            {loadingDelete ? "Deleting…" : "Delete my account"}
          </Button>
        </div>
      </section>

      {/* Messages */}
      {(errorMessage || successMessage) && (
        <div
          className={`rounded-md p-4 ${
            errorMessage
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          <Typography variant="body-base">
            {errorMessage ?? successMessage}
          </Typography>
        </div>
      )}
    </div>
  );
}
