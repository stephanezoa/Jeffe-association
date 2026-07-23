import { Route, Routes } from 'react-router-dom';
import { ScrollToTop } from './components/layout/ScrollToTop';
import LandingPage from './pages/LandingPage';
import VestigePage from './pages/VestigePage';
import FormationsPage from './pages/FormationsPage';
import FormationDetailPage from './pages/FormationDetailPage';
import ActualitesPage from './pages/ActualitesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import GaleriePage from './pages/GaleriePage';
import ContactPage from './pages/ContactPage';
import ConnexionPage from './pages/ConnexionPage';
import EspacePage from './pages/EspacePage';
import PlaceholderPage from './pages/PlaceholderPage';
import { RequireAuth } from './components/auth/RequireAuth';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import DashboardHomePage from './pages/dashboard/DashboardHomePage';
import DashboardFormationsPage from './pages/dashboard/DashboardFormationsPage';
import DashboardEvenementsPage from './pages/dashboard/DashboardEvenementsPage';
import DashboardParrainagePage from './pages/dashboard/DashboardParrainagePage';
import DashboardParrainageAjouterPage from './pages/dashboard/DashboardParrainageAjouterPage';
import DashboardArticlesPage from './pages/dashboard/DashboardArticlesPage';
import DashboardArticleFormPage from './pages/dashboard/DashboardArticleFormPage';
import DashboardFormationFormPage from './pages/dashboard/DashboardFormationFormPage';
import DashboardEvenementFormPage from './pages/dashboard/DashboardEvenementFormPage';
import DashboardMonComptePage from './pages/dashboard/DashboardMonComptePage';
import DashboardMonCompteEditPage from './pages/dashboard/DashboardMonCompteEditPage';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/vestige" element={<VestigePage />} />
        <Route path="/formations" element={<FormationsPage />} />
        <Route path="/formations/:id" element={<FormationDetailPage />} />
        <Route path="/actualites" element={<ActualitesPage />} />
        <Route path="/actualites/:slug" element={<ArticleDetailPage />} />
        <Route path="/galerie" element={<GaleriePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/connexion" element={<ConnexionPage />} />
        <Route
          path="/mot-de-passe-oublie"
          element={
            <PlaceholderPage
              title="Mot de passe oublié"
              description="La réinitialisation en ligne n'est pas encore disponible. Contactez l'équipe Excelle Wellth pour retrouver l'accès à votre compte."
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardHomePage />} />

          <Route path="formations" element={<DashboardFormationsPage />} />
          <Route path="formations/creer" element={<DashboardFormationFormPage />} />
          <Route path="formations/:id/modifier" element={<DashboardFormationFormPage />} />

          <Route path="articles" element={<DashboardArticlesPage />} />
          <Route path="articles/creer" element={<DashboardArticleFormPage />} />
          <Route path="articles/:id/modifier" element={<DashboardArticleFormPage />} />

          <Route path="evenements" element={<DashboardEvenementsPage />} />
          <Route path="evenements/creer" element={<DashboardEvenementFormPage />} />
          <Route path="evenements/:id/modifier" element={<DashboardEvenementFormPage />} />

          <Route path="parrainage" element={<DashboardParrainagePage />} />
          <Route path="parrainage/ajouter" element={<DashboardParrainageAjouterPage />} />

          <Route path="mon-compte" element={<DashboardMonComptePage />} />
          <Route path="mon-compte/modifier" element={<DashboardMonCompteEditPage />} />
        </Route>

        <Route path="/espace" element={<EspacePage />} />
        <Route
          path="*"
          element={
            <PlaceholderPage
              title="Page introuvable"
              description="Le lien que vous avez suivi n'existe pas ou a été déplacé."
            />
          }
        />
      </Routes>
    </>
  );
}
