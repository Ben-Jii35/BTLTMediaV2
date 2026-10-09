# BTLTMedia — V2

Refonte graphique autonome du site d'origine, en HTML, CSS et JavaScript, sans installation ni compilation.

Ouvrir `index.html` dans un navigateur permet de prévisualiser la page d’accueil. Les mentions légales et la politique de confidentialité sont également incluses. Le contrôle hCaptcha ne fonctionne pas depuis un fichier ouvert en `file://` ni depuis `localhost` ; dans ces aperçus, le formulaire affiche une explication et l'envoi est désactivé. Son test réel doit être fait depuis le site publié sous son nom de domaine.

La palette, les liens, les images et les interactions de la version d’origine sont conservés. Les textes présentent désormais BTLTMedia comme une agence, sans promesse de réponse sous 24 heures. La section « Notre approche » présente les leviers contenu et publicité avec une hiérarchie commune aux autres sections, des soulignements dessinés et un emplacement vidéo au format 16:9. Le dossier parent reste inchangé.

Le design V2 est défini dans `assets/css/v2.css`, chargé après les styles d'origine. Il comprend une accroche asymétrique, une composition de pellicule utilisant la photographie existante, une grille de services, un processus sur fond bleu et un encart contact en deux parties : introduction bleue et formulaire blanc. Les mises en page s'adaptent aux écrans mobiles et respectent la préférence de réduction des animations.

Couleurs principales : orange `#F2AC3C`, bleu `#0F3D5E`. Les tokens de couleurs d'origine restent dans `assets/css/base/tokens.css`.

Le formulaire de contact envoie désormais les demandes via Web3Forms avec un retour de succès ou d'erreur sur la page. La protection hCaptcha est activée dans Web3Forms et affichée dans le formulaire ; elle nécessite JavaScript. Si seul le script local ne fonctionne pas, l'envoi HTML utilise la redirection de confirmation de Web3Forms. Les six logos et trois témoignages de démonstration sont conservés temporairement comme demandé. Le SIREN / RNE, les attributions des visuels et la durée des journaux OVHcloud restent à renseigner. La rubrique de médiation dépend de la présence ou non de clients particuliers.

Le référencement cible Vitré, Rennes, Saint-Malo et l'Ille-et-Vilaine avec un titre et une description dédiés, des liens canoniques, des données structurées `ProfessionalService`, une image de partage, `robots.txt` et `sitemap.xml`. Le domaine canonique est `https://btlt-media.fr/`. Après publication, vérifier que ce domaine répond bien, que `/robots.txt` et `/sitemap.xml` sont accessibles, puis envoyer le sitemap dans Google Search Console. Le sitemap et les balises ne garantissent pas une position dans les résultats.

La politique de confidentialité décrit maintenant les champs obligatoires, Web3Forms, les transferts possibles et la durée de conservation d'un an maximum confirmée pour les soumissions Web3Forms. La boîte `contact@btlt-media.fr` doit être créée chez OVHcloud ; son éventuelle connexion à Gmail reste à confirmer. La suppression des demandes un an après le dernier échange doit être appliquée dans la messagerie réellement utilisée. Les modalités de conservation des documents contractuels et comptables doivent être précisées lors de la relation client. Vérifier l’hébergeur effectif et les éventuels cookies au déploiement. Tester un envoi réel depuis le site publié et vérifier sa réception dans la boîte de destination.
