import ForgotPasswordContainer from "@/ui/modules/forgot-password/forgot-password.container";
import Layout from "@/ui/components/layout/layout";

/**
 * Page de mot de passe oublié - Permet aux utilisateurs de demander une réinitialisation
 * de leur mot de passe via un email de récupération
 */
export default function ForgotPasswordPage() {
  return (
    <Layout>
      <ForgotPasswordContainer />
    </Layout>
  );
}
