import LoginContainer from "@/ui/modules/login/login.container";
import Layout from "@/ui/components/layout/layout";

/**
 * Page de connexion - Permet aux utilisateurs de se connecter à leur compte PokeFav
 * Utilise le contexte d'authentification pour gérer la connexion
 */
export default function LoginPage() {
  return (
    <Layout>
      <LoginContainer />
    </Layout>
  );
}
