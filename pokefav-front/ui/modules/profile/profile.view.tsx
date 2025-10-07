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
        <Typography variant="h4">Sécurité</Typography>
        <div className="flex flex-col gap-2">
          <Typography variant="body-base">
            Vous pouvez recevoir un email pour modifier votre mot de passe.
          </Typography>
          <div>
            <Button
              size="medium"
              disabled={loadingReset}
              action={onRequestPasswordReset}
            >
              {loadingReset
                ? "Envoi en cours…"
                : "Envoyer l’email de modification"}
            </Button>
          </div>
          <Typography variant="body-sm" className="text-zinc-500">
            Un lien est envoyé à votre adresse. Vous pouvez aussi passer par la
            page “Mot de passe oublié”.
          </Typography>
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-white rounded-xl shadow-sm border border-red-200/60 p-6 space-y-4">
        <Typography variant="h4" className="text-red-600">
          Zone dangereuse
        </Typography>
        <Typography variant="body-base">
          Supprimer votre compte est irréversible. Tapez votre nom d’affichage
          exact pour confirmer.
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
            {loadingDelete ? "Suppression…" : "Supprimer mon compte"}
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
