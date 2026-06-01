document.addEventListener('DOMContentLoaded', function () {

    const mobileBurger = document.getElementById('mobileBurger');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  if (!mobileBurger || !mobileMenu) return;
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  mobileBurger.setAttribute('aria-expanded', 'false');
}

function toggleMobileMenu(e) {
  if (!mobileBurger || !mobileMenu) return;
  e.stopPropagation();
  const open = mobileMenu.classList.toggle('open');
  mobileMenu.setAttribute('aria-hidden', String(!open));
  mobileBurger.setAttribute('aria-expanded', String(open));
}

if (mobileBurger && mobileMenu) {
  mobileBurger.addEventListener('click', toggleMobileMenu);

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => closeMobileMenu());
  });

  document.addEventListener('click', () => closeMobileMenu());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

const mobileFooter = document.getElementById('mobileFooter');
const mobileFooterToggle = document.getElementById('mobileFooterToggle');

function closeMobileFooter() {
  if (!mobileFooter || !mobileFooterToggle) return;
  mobileFooter.classList.remove('open');
  mobileFooter.setAttribute('aria-hidden', 'true');
  mobileFooterToggle.setAttribute('aria-expanded', 'false');
}

function toggleMobileFooter(e) {
  if (!mobileFooter || !mobileFooterToggle) return;
  e.stopPropagation();
  const open = mobileFooter.classList.toggle('open');
  mobileFooter.setAttribute('aria-hidden', String(!open));
  mobileFooterToggle.setAttribute('aria-expanded', String(open));
}

function closeMobileFooter() {
  if (!mobileFooter || !mobileFooterToggle) return;
  mobileFooter.classList.remove('open');
  document.body.classList.remove('footer-open');   // <-- add
  mobileFooter.setAttribute('aria-hidden', 'true');
  mobileFooterToggle.setAttribute('aria-expanded', 'false');
}

function toggleMobileFooter(e) {
  if (!mobileFooter || !mobileFooterToggle) return;
  e.stopPropagation();
  const open = mobileFooter.classList.toggle('open');
  document.body.classList.toggle('footer-open', open); // <-- add
  mobileFooter.setAttribute('aria-hidden', String(!open));
  mobileFooterToggle.setAttribute('aria-expanded', String(open));
  mobileFooterToggle.textContent = open ? '✕' : 'ⓘ';
}

if (mobileFooter && mobileFooterToggle) {
  mobileFooterToggle.addEventListener('click', toggleMobileFooter);

  document.addEventListener('click', () => closeMobileFooter());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileFooter();
  });
}

    // ===============================
    // Sélection des éléments utiles
    // ===============================

    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const procedureDetailCard = document.getElementById('procedureDetailCard');
    const procedureDetailTitle = document.getElementById('procedureDetailTitle');
    const procedureThumbnail = document.getElementById('procedureThumbnail');
    const procedureThumbnailButton = document.getElementById('procedureThumbnailButton');
    const procedureDetailContent = document.getElementById('procedureDetailContent');
    const closeProcedureDetail = document.querySelector('.close-procedure-detail');
    const topNavLinks = document.querySelectorAll('.nav-link');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.section-page');
    const yearSpan = document.getElementById('year');

    // On regroupe tous les liens de navigation (header + sidebar)
    const allNavLinks = [...topNavLinks, ...sidebarLinks];

    // ===============================
    // Mise à jour de l’année en footer
    // ===============================

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ===============================
    // Helpers
    // ===============================

    function escapeHtml(value) {
  const str = String(value ?? '');
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

    function normalizeId(raw) {
        if (!raw) return '';
        return raw.replace('#', '').trim();
    }

    function setActiveLinkState(id) {
        allNavLinks.forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === '#' + id) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    // ===============================
// BTS - fermeture (safe) : ne plante jamais si éléments absents
// ===============================
let openedBtsCard = null; // une seule déclaration dans tout le fichier

function closeBtsTable() {
  const wrap = document.getElementById('btsTableWrap');
  const grid = document.getElementById('btsTableGrid');

  if (wrap) {
    wrap.classList.remove('is-visible');
    wrap.setAttribute('aria-hidden', 'true');
  }
  if (grid) grid.innerHTML = '';

  document.querySelectorAll('.bts-card.is-selected')
    .forEach(c => c.classList.remove('is-selected'));

  openedBtsCard = null;
}

    // ===============================
    // Fonction d'affichage d'une "page"
    // ===============================

    function showSectionById(id, options) {
        const opts = options || {};
        const updateUrl = opts.updateUrl !== false;

        // Masquer toutes les sections
        sections.forEach(function (section) {
            section.classList.remove('active-section');
        });

        closeBtsTable();

        // Afficher celle qui correspond à l'id
        const target = document.getElementById(id);

        // Fallback si id invalide
        const finalTarget = target || document.getElementById('accueil');
        if (!finalTarget) return;

        finalTarget.classList.add('active-section');
        setActiveLinkState(finalTarget.id);

        // Mettre à jour l'URL (hash) pour partage / refresh / bouton retour
        if (updateUrl) {
            if (location.hash !== '#' + finalTarget.id) {
                history.pushState({ section: finalTarget.id }, '', '#' + finalTarget.id);
            }
        }
    }

    // ===============================
    // Affichage initial : hash ou accueil
    // ===============================

    const initialId = normalizeId(location.hash) || 'accueil';
    showSectionById(initialId, { updateUrl: false });

    // ===============================
    // Gestion bouton "Retour" navigateur
    // ===============================

    window.addEventListener('popstate', function () {
        const idFromHash = normalizeId(location.hash) || 'accueil';
        showSectionById(idFromHash, { updateUrl: false });
    });

    // ===============================
    // Gestion du menu burger (mobile)
    // ===============================

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
        });
    }

    if (sidebar && sidebarToggle) {
        sidebarToggle.addEventListener('click', function (event) {
            event.stopPropagation();
            const collapsed = sidebar.classList.toggle('collapsed');
            sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
            sidebarToggle.setAttribute('aria-label', collapsed ? 'Ouvrir la barre latérale' : 'Réduire la barre latérale');
            sidebarToggle.textContent = collapsed ? '⇥' : '⇤';
        });
    }

    const proceduresDetailMap = {
        'Prise en charge d\'un ticket utilisateur avec ServiceNow': `
            <h4>Contexte</h4>
            <p class="card-text">Durant mon stage, les demandes utilisateurs étaient centralisées dans ServiceNow. Cet outil permettait de suivre les incidents, de qualifier les demandes et de documenter les actions réalisées par l’équipe Helpdesk.</p>
            <h4>Objectif</h4>
            <p class="card-text">Prendre en charge une demande utilisateur depuis sa réception jusqu’à sa résolution ou son escalade vers une équipe spécialisée.</p>
            <h4>Outils utilisés</h4>
            <p class="card-text">ServiceNow, Microsoft Teams, base de connaissances interne.</p>
            <h4>Étapes principales</h4>
            <p class="card-text">La première étape consiste à consulter la file des tickets dans ServiceNow. Le technicien identifie ensuite le ticket à traiter, lit la description de la demande et vérifie les informations disponibles : utilisateur concerné, poste utilisé, service impacté, niveau d’urgence et catégorie de l’incident.</p>
            <p class="card-text">Si les informations sont insuffisantes, l’utilisateur est contacté afin d’obtenir des précisions. Un échange peut être réalisé via Microsoft Teams pour comprendre le problème, demander des captures ou accompagner l’utilisateur à distance.</p>
            <p class="card-text">Une fois le diagnostic réalisé, le technicien applique une solution si le problème est connu. Si la demande dépasse son niveau d’intervention, le ticket est escaladé vers l’équipe compétente. Toutes les actions effectuées sont documentées dans ServiceNow afin de conserver une trace de l’intervention.</p>
            <p class="card-text">Le ticket est ensuite clôturé uniquement après validation de la résolution ou après transmission correcte à une autre équipe.</p>
            <h4>Résultat attendu</h4>
            <p class="card-text">Le ticket est correctement qualifié, traité, documenté et clôturé. Si la résolution n’est pas possible au premier niveau, l’escalade contient suffisamment d’informations pour permettre la poursuite du traitement.</p>
            <h4>Compétences E5 associées</h4>
            <ul>
                <li>Collecter, suivre et orienter des demandes.</li>
                <li>Répondre aux incidents et aux demandes d’assistance.</li>
                <li>Traiter des demandes concernant les services réseau, système ou applicatifs.</li>
            </ul>
        `,
        'Assistance utilisateur à distance avec Microsoft Teams': `
            <h4>Contexte</h4>
            <p class="card-text">Dans un contexte Helpdesk, Microsoft Teams peut être utilisé pour communiquer avec les utilisateurs, effectuer un accompagnement à distance et guider la résolution d’un incident.</p>
            <h4>Objectif</h4>
            <p class="card-text">Assister un utilisateur à distance afin de diagnostiquer et résoudre un problème informatique sans intervention physique directe.</p>
            <h4>Outils utilisés</h4>
            <p class="card-text">Microsoft Teams, ServiceNow, poste utilisateur, documentation interne.</p>
            <h4>Étapes principales</h4>
            <p class="card-text">La demande est d’abord consultée dans ServiceNow afin d’identifier le problème signalé. L’utilisateur est ensuite contacté via Microsoft Teams pour confirmer les informations et obtenir davantage de détails sur les symptômes rencontrés.</p>
            <p class="card-text">Selon la situation, un appel Teams ou un partage d’écran peut être proposé. L’utilisateur est guidé étape par étape afin de reproduire le problème ou de vérifier certains paramètres : connexion réseau, ouverture de session, accès à une application, message d’erreur ou comportement anormal.</p>
            <p class="card-text">Le technicien applique ensuite les vérifications de base et propose une solution adaptée. Une fois la correction effectuée, l’utilisateur est invité à tester de nouveau le service ou l’application concernée.</p>
            <p class="card-text">Enfin, le ticket ServiceNow est mis à jour avec les actions réalisées, le résultat obtenu et la confirmation de l’utilisateur.</p>
            <h4>Résultat attendu</h4>
            <p class="card-text">L’utilisateur est accompagné efficacement et le problème est résolu ou correctement orienté vers une autre équipe.</p>
            <h4>Compétences E5 associées</h4>
            <ul>
                <li>Répondre aux incidents et demandes d’assistance.</li>
                <li>Traiter des demandes applicatives.</li>
                <li>Accompagner les utilisateurs dans la mise en place ou l’utilisation d’un service.</li>
                <li>Collecter et suivre une demande.</li>
            </ul>
        `,
        'Diagnostic d\'un incident avec Splunk': `
            <h4>Contexte</h4>
            <p class="card-text">Splunk est un outil permettant de rechercher et analyser des événements ou des logs. Il peut être utilisé pour aider au diagnostic d’un incident utilisateur, applicatif ou système.</p>
            <h4>Objectif</h4>
            <p class="card-text">Rechercher des informations techniques permettant de confirmer, préciser ou orienter l’origine d’un incident.</p>
            <h4>Outils utilisés</h4>
            <p class="card-text">Splunk, ServiceNow, Microsoft Teams.</p>
            <h4>Étapes principales</h4>
            <p class="card-text">Le diagnostic commence par la lecture du ticket dans ServiceNow. Les informations utiles sont relevées : nom de l’utilisateur, poste concerné, application utilisée, date et heure de l’incident, message d’erreur éventuel.</p>
            <p class="card-text">À partir de ces éléments, une recherche est effectuée dans Splunk sur la période concernée. Les résultats sont filtrés afin d’identifier les événements liés à l’utilisateur, au poste ou à l’application.</p>
            <p class="card-text">Les logs pertinents sont ensuite analysés pour repérer d’éventuelles erreurs, alertes, échecs d’authentification ou anomalies. Les éléments trouvés sont comparés avec les informations fournies par l’utilisateur.</p>
            <p class="card-text">Les résultats utiles sont ajoutés au ticket ServiceNow. Si l’incident nécessite une expertise plus avancée, le ticket est transmis à l’équipe compétente avec les logs ou informations nécessaires.</p>
            <h4>Résultat attendu</h4>
            <p class="card-text">L’analyse Splunk permet d’orienter le diagnostic et d’apporter des éléments techniques fiables au traitement du ticket.</p>
            <h4>Compétences E5 associées</h4>
            <ul>
                <li>Traiter des demandes concernant les services réseau, système ou applicatifs.</li>
                <li>Vérifier les conditions de continuité d’un service informatique.</li>
                <li>Répondre aux incidents et demandes d’assistance.</li>
                <li>Orienter une demande vers le bon niveau de support.</li>
            </ul>
        `,
        'Rédaction d’une procédure de support avec Atlassian': `
            <h4>Contexte</h4>
            <p class="card-text">Après la résolution d’un incident récurrent ou d’une demande technique, il est utile de rédiger une procédure afin de faciliter les futures interventions. En stage, les outils Atlassian peuvent être utilisés pour documenter les solutions et partager les connaissances avec l’équipe.</p>
            <h4>Objectif</h4>
            <p class="card-text">Créer une procédure claire, structurée et réutilisable par l’équipe support.</p>
            <h4>Outils utilisés</h4>
            <p class="card-text">Atlassian, ServiceNow, Microsoft Teams, documentation interne.</p>
            <h4>Étapes principales</h4>
            <p class="card-text">La rédaction commence par l’identification d’un besoin de documentation. Ce besoin peut provenir d’un incident récurrent, d’une solution nouvellement trouvée ou d’une demande régulièrement traitée par l’équipe Helpdesk.</p>
            <p class="card-text">Les informations nécessaires sont ensuite rassemblées : contexte du problème, prérequis, étapes de résolution, points de vigilance et vérifications à effectuer après intervention.</p>
            <p class="card-text">Une page est créée ou mise à jour dans l’espace Atlassian. La procédure est structurée avec un titre clair, une description du problème, les étapes de résolution et les éventuelles captures autorisées.</p>
            <p class="card-text">Après rédaction, la procédure est relue afin de vérifier sa clarté et sa cohérence. Elle peut ensuite être partagée à l’équipe ou liée à un ticket ServiceNow afin de faciliter les interventions futures.</p>
            <h4>Résultat attendu</h4>
            <p class="card-text">La procédure est disponible pour l’équipe support et permet de traiter plus rapidement un problème similaire.</p>
            <h4>Compétences E5 associées</h4>
            <ul>
                <li>Exploiter des référentiels, normes et standards.</li>
                <li>Travailler en mode projet.</li>
                <li>Répondre aux incidents et demandes d’assistance.</li>
                <li>Organiser son développement professionnel.</li>
            </ul>
        `,
        'Suivi d\'une demande ou d\'un mini-projet avec Atlassian': `
            <h4>Contexte</h4>
            <p class="card-text">Dans un environnement professionnel, les outils Atlassian permettent de suivre des tâches, de documenter l’avancement d’une demande et d’organiser le travail en équipe.</p>
            <h4>Objectif</h4>
            <p class="card-text">Suivre une demande ou une tâche technique depuis sa création jusqu’à sa finalisation.</p>
            <h4>Outils utilisés</h4>
            <p class="card-text">Atlassian, ServiceNow, Microsoft Teams.</p>
            <h4>Étapes principales</h4>
            <p class="card-text">La demande est d’abord identifiée à partir d’un besoin utilisateur, d’un ticket ServiceNow ou d’une action à réaliser en équipe. Une tâche est ensuite créée dans Atlassian avec un titre clair et une description précise.</p>
            <p class="card-text">Les informations importantes sont ajoutées : objectif, priorité, personne ou équipe responsable, date limite, dépendances et état initial. La tâche est ensuite suivie au fur et à mesure de son avancement.</p>
            <p class="card-text">Des commentaires sont ajoutés pour tracer les actions réalisées. Si nécessaire, des échanges sont effectués avec l’équipe via Microsoft Teams. Lorsque la demande est terminée, les résultats sont vérifiés, puis la tâche est clôturée avec un résumé de l’action réalisée.</p>
            <h4>Résultat attendu</h4>
            <p class="card-text">La demande est suivie de manière structurée et l’avancement est visible pour les membres de l’équipe.</p>
            <h4>Compétences E5 associées</h4>
            <ul>
                <li>Analyser les objectifs et les modalités d’organisation d’un projet.</li>
                <li>Planifier les activités.</li>
                <li>Évaluer les indicateurs de suivi et analyser les écarts.</li>
                <li>Travailler en mode projet.</li>
            </ul>
            
        `,
        'Vérification des habilitations d\'un utilisateur': `
            <h4>Contexte</h4>
            <p class="card-text">Dans une organisation, chaque utilisateur doit disposer uniquement des droits nécessaires à ses missions. La vérification des habilitations permet de limiter les risques liés aux accès excessifs ou inadaptés.</p>
            <h4>Objectif</h4>
            <p class="card-text">Contrôler ou mettre à jour les droits d’un utilisateur sur une ressource, une application ou un service.</p>
            <h4>Outils utilisés</h4>
            <p class="card-text">ServiceNow, Microsoft Teams, outil interne de gestion des accès, éventuellement Active Directory.</p>
            <h4>Étapes principales</h4>
            <p class="card-text">La demande d’accès est d’abord consultée dans ServiceNow. Le technicien identifie l’utilisateur concerné, le service demandé et la ressource ou application visée.</p>
            <p class="card-text">Les droits actuels de l’utilisateur sont ensuite vérifiés. Ils sont comparés avec le besoin exprimé dans la demande. Si une validation hiérarchique ou métier est nécessaire, elle doit être obtenue avant toute modification.</p>
            <p class="card-text">Lorsque la demande est autorisée, les droits sont ajoutés, modifiés ou supprimés selon le besoin. L’accès est ensuite testé avec l’utilisateur ou confirmé par celui-ci.</p>
            <p class="card-text">Enfin, l’action réalisée est documentée dans le ticket ServiceNow. Le ticket est clôturé uniquement après validation du bon fonctionnement.</p>
            <h4>Résultat attendu</h4>
            <p class="card-text">L’utilisateur dispose des droits adaptés à son besoin, sans accès excessif ou non justifié.</p>
            <h4>Compétences E5 associées</h4>
            <ul>
                <li>Mettre en place et vérifier les niveaux d’habilitation associés à un service.</li>
                <li>Vérifier le respect des règles d’utilisation des ressources numériques.</li>
                <li>Répondre aux incidents et demandes d’assistance.</li>
            </ul>
            
        `,
        'Installation et configuration de GLPI sur Debian 12': `
            <h4>Contexte</h4>
            <p class="card-text">Dans le cadre de l’infrastructure de formation, GLPI est utilisé pour gérer le parc informatique, suivre les équipements et centraliser les demandes d’assistance.</p>
            <h4>Objectif</h4>
            <p class="card-text">Installer GLPI sur un serveur Debian 12 afin de mettre à disposition un service de gestion de parc informatique.</p>
            <h4>Outils utilisés</h4>
            <p class="card-text">Debian 12, Apache2, MariaDB, PHP, GLPI, navigateur web.</p>
            <h4>Étapes principales</h4>
            <p class="card-text">La première étape consiste à préparer le serveur Debian 12 et à vérifier sa connectivité réseau. Le serveur est ensuite mis à jour, puis les services nécessaires sont installés : Apache2 pour le serveur web, MariaDB pour la base de données et PHP pour l’exécution de GLPI.</p>
            <p class="card-text">Une base de données dédiée à GLPI est créée, ainsi qu’un utilisateur disposant des droits nécessaires. Les fichiers GLPI sont ensuite téléchargés, placés dans le répertoire web et configurés avec les permissions adaptées.</p>
            <p class="card-text">La configuration Apache est créée ou modifiée afin de rendre GLPI accessible depuis un navigateur. Après redémarrage du service web, l’assistant d’installation de GLPI est lancé depuis l’interface web.</p>
            <p class="card-text">Les informations de connexion à la base de données sont renseignées, puis l’installation est finalisée. L’accès à l’interface administrateur est ensuite testé.</p>
            <h4>Résultat attendu</h4>
            <p class="card-text">GLPI est accessible depuis le réseau et peut être utilisé pour gérer les équipements, les utilisateurs et les tickets.</p>
            <h4>Compétences E5 associées</h4>
            <ul>
                <li>Mettre à disposition des utilisateurs un service informatique.</li>
                <li>Déployer un service.</li>
                <li>Réaliser les tests d’intégration et d’acceptation d’un service.</li>
                <li>Gérer le patrimoine informatique.</li>
            </ul>
            
        `,
        'Déploiement de l’agent GLPI sur un poste Windows': `
            <h4>Contexte</h4>
            <p class="card-text">L’agent GLPI permet de remonter automatiquement les informations matérielles et logicielles d’un poste vers le serveur GLPI. Il facilite le recensement du parc informatique.</p>
            <h4>Objectif</h4>
            <p class="card-text">Installer et configurer l’agent GLPI sur un poste Windows afin de l’intégrer automatiquement à l’inventaire.</p>
            <h4>Outils utilisés</h4>
            <p class="card-text">GLPI, GLPI Agent, Windows, navigateur web.</p>
            <h4>Étapes principales</h4>
            <p class="card-text">Le serveur GLPI doit d’abord être accessible depuis le poste Windows. L’agent GLPI est ensuite téléchargé depuis une source officielle, puis lancé avec les droits administrateur.</p>
            <p class="card-text">Pendant l’installation, l’adresse du serveur GLPI est renseignée afin que l’agent puisse envoyer les informations d’inventaire. Les options d’inventaire sont sélectionnées selon les besoins.</p>
            <p class="card-text">Une fois l’installation terminée, un inventaire manuel peut être lancé pour vérifier le bon fonctionnement de l’agent. Le technicien se connecte ensuite à GLPI pour vérifier que le poste apparaît bien dans l’inventaire.</p>
            <p class="card-text">Les informations remontées sont contrôlées : nom du poste, système d’exploitation, composants matériels, logiciels installés et adresse réseau.</p>
            <h4>Résultat attendu</h4>
            <p class="card-text">Le poste Windows est automatiquement ajouté à GLPI avec ses informations matérielles et logicielles.</p>
            <h4>Compétences E5 associées</h4>
            <ul>
                <li>Recenser et identifier les ressources numériques.</li>
                <li>Gérer le patrimoine informatique.</li>
                <li>Déployer un service.</li>
                <li>Vérifier le fonctionnement d’un service informatique.</li>
            </ul>
            
        `,
        'Diagnostic réseau avec Wireshark': `
            <h4>Contexte</h4>
            <p class="card-text">Wireshark est utilisé pour analyser le trafic réseau et diagnostiquer des problèmes de connectivité, de résolution DNS, d’attribution DHCP ou de communication entre machines.</p>
            <h4>Objectif</h4>
            <p class="card-text">Capturer et analyser des paquets réseau afin d’identifier l’origine d’un dysfonctionnement.</p>
            <h4>Outils utilisés</h4>
            <p class="card-text">Wireshark, poste Windows ou Debian, pfSense, services DNS/DHCP.</p>
            <h4>Étapes principales</h4>
            <p class="card-text">La première étape consiste à ouvrir Wireshark et à sélectionner l’interface réseau active. Une capture est ensuite lancée pendant que le problème est reproduit : test ping, résolution DNS, demande DHCP ou accès à un service.</p>
            <p class="card-text">Une fois la capture terminée, des filtres sont appliqués pour faciliter l’analyse. Le filtre ICMP peut être utilisé pour un problème de ping, le filtre DNS pour une résolution de nom, le filtre DHCP ou BOOTP pour une attribution d’adresse IP, et le filtre ARP pour analyser les échanges d’adresses MAC.</p>
            <p class="card-text">Les paquets sont ensuite examinés afin d’identifier une absence de réponse, un délai anormal, une erreur ou une mauvaise configuration. Les résultats sont notés, puis une correction est proposée : vérification de l’adresse IP, de la passerelle, du DNS, du firewall et de la connectivité réseau.</p>
            <p class="card-text">Un nouveau test est réalisé après correction pour vérifier que le problème est résolu.</p>
            <h4>Résultat attendu</h4>
            <p class="card-text">L’analyse Wireshark permet d’identifier ou d’orienter la cause du problème réseau.</p>
            <h4>Compétences E5 associées</h4>
            <ul>
                <li>Traiter des demandes concernant les services réseau et système.</li>
                <li>Vérifier les conditions de continuité d’un service informatique.</li>
                <li>Répondre aux incidents et demandes d’assistance.</li>
            </ul>
            
        `,
        'Test DNS et DHCP sur Windows Server': `
            <h4>Contexte</h4>
            <p class="card-text">Les services DNS et DHCP sont essentiels au fonctionnement d’un réseau d’entreprise. Le DHCP attribue automatiquement une configuration IP aux postes clients, tandis que le DNS permet de résoudre les noms en adresses IP.</p>
            <h4>Objectif</h4>
            <p class="card-text">Vérifier qu’un poste client reçoit une configuration IP correcte et peut résoudre les noms grâce au serveur DNS.</p>
            <h4>Outils utilisés</h4>
            <p class="card-text">Windows Server, console DHCP, console DNS, invite de commandes Windows, poste client.</p>
            <h4>Étapes principales</h4>
            <p class="card-text">La vérification commence sur le serveur Windows. La console DHCP est ouverte afin de contrôler que l’étendue est active, que la plage d’adresses est correcte et que les options DHCP sont bien renseignées, notamment la passerelle et le serveur DNS.</p>
            <p class="card-text">La console DNS est ensuite vérifiée afin de contrôler la présence des zones nécessaires et des enregistrements utiles.</p>
            <p class="card-text">Sur le poste client, la configuration IP est renouvelée à l’aide des commandes <code>ipconfig /release</code> puis <code>ipconfig /renew</code>. La commande <code>ipconfig /all</code> permet ensuite de vérifier l’adresse IP obtenue, la passerelle et le serveur DNS configuré.</p>
            <p class="card-text">La résolution DNS est testée avec <code>nslookup</code>, puis la connectivité est vérifiée avec <code>ping</code>. En cas d’échec, les paramètres DHCP, DNS, firewall et connectivité réseau sont contrôlés.</p>
            <h4>Résultat attendu</h4>
            <p class="card-text">Le poste client reçoit une adresse IP valide et peut résoudre les noms via le serveur DNS.</p>
            <h4>Compétences E5 associées</h4>
            <ul>
                <li>Traiter des demandes concernant les services réseau et système.</li>
                <li>Vérifier les conditions de continuité d’un service informatique.</li>
                <li>Réaliser les tests d’intégration et d’acceptation d’un service.</li>
            </ul>
            
        `,
        'Supervision d\'un serveur avec Zabbix Agent': `
            <h4>Contexte</h4>
            <p class="card-text">La supervision permet de contrôler l’état d’un serveur et d’anticiper les incidents. Zabbix Agent peut être installé sur un serveur afin de remonter des informations vers une console de supervision.</p>
            <h4>Objectif</h4>
            <p class="card-text">Installer et configurer Zabbix Agent pour suivre l’état d’un serveur.</p>
            <h4>Outils utilisés</h4>
            <p class="card-text">Zabbix Agent, serveur Zabbix, Debian ou Windows, interface web Zabbix.</p>
            <h4>Étapes principales</h4>
            <p class="card-text">L’agent Zabbix est installé sur le serveur à superviser. Une fois installé, son fichier de configuration est modifié afin de renseigner l’adresse du serveur Zabbix et le nom de l’hôte supervisé.</p>
            <p class="card-text">Le service Zabbix Agent est ensuite redémarré, puis son état est vérifié pour s’assurer qu’il fonctionne correctement. Dans l’interface web Zabbix, un nouvel hôte est créé avec le même nom que celui défini dans la configuration de l’agent.</p>
            <p class="card-text">Un modèle de supervision est associé à l’hôte afin de récupérer les informations utiles : disponibilité, charge système, mémoire, disque ou réseau.</p>
            <p class="card-text">Après quelques instants, les dernières données reçues sont vérifiées dans Zabbix. Si aucune donnée ne remonte, la configuration réseau, le pare-feu ou le nom de l’hôte sont contrôlés.</p>
            <h4>Résultat attendu</h4>
            <p class="card-text">Le serveur est visible dans Zabbix et ses informations de supervision remontent correctement.</p>
            <h4>Compétences E5 associées</h4>
            <ul>
                <li>Vérifier les conditions de continuité d’un service informatique.</li>
                <li>Déployer un service.</li>
                <li>Réaliser les tests d’intégration et d’acceptation d’un service.</li>
                <li>Gérer le patrimoine informatique.</li>
            </ul>
            
        `,
        'Mise à jour du portfolio web et veille technologique': `
            <h4>Contexte</h4>
            <p class="card-text">Le portfolio web permet de présenter les réalisations professionnelles, les compétences et la veille technologique dans le cadre du BTS SIO. Il participe également à la construction de l’identité professionnelle.</p>
            <h4>Objectif</h4>
            <p class="card-text">Publier une nouvelle réalisation professionnelle ou une information de veille afin de valoriser son parcours et ses compétences.</p>
            <h4>Outils utilisés</h4>
            <p class="card-text">GitHub, GitHub Pages, éditeur de code, navigateur web, sources de veille.</p>
            <h4>Étapes principales</h4>
            <p class="card-text">Le contenu à ajouter est d’abord préparé : titre de la réalisation, contexte, objectif, outils utilisés, compétences associées et preuves à intégrer. Les captures sont sélectionnées et anonymisées si nécessaire.</p>
            <p class="card-text">Les fichiers du portfolio sont ensuite modifiés dans l’éditeur de code. La nouvelle réalisation ou la nouvelle veille est ajoutée dans la page correspondante. Les liens internes et l’affichage sont vérifiés localement.</p>
            <p class="card-text">Les modifications sont ensuite envoyées sur GitHub. Une fois la publication effectuée avec GitHub Pages, le site est ouvert dans un navigateur afin de vérifier que la page est accessible et correctement affichée.</p>
            <p class="card-text">La veille technologique est mise à jour avec les sources consultées, les informations importantes et l’intérêt professionnel de chaque élément retenu.</p>
            <h4>Résultat attendu</h4>
            <p class="card-text">Le portfolio est mis à jour, accessible en ligne et présente clairement les réalisations professionnelles et la veille technologique.</p>
            <h4>Compétences E5 associées</h4>
            <ul>
                <li>Développer la présence en ligne de l’organisation.</li>
                <li>Participer à l’évolution d’un site web.</li>
                <li>Référencer les services en ligne et mesurer leur visibilité.</li>
                <li>Mettre en œuvre des outils et stratégies de veille informationnelle.</li>
                <li>Gérer son identité professionnelle.</li>
                <li>Développer son projet professionnel.</li>
            </ul>
            
        `
    };

    function openProcedureDetail(card) {
        if (!procedureDetailCard || !procedureDetailTitle || !procedureDetailContent || !card) return;
        const selectedTitle = card.dataset.procedureTitle || card.querySelector('.card-title')?.textContent.trim() || 'Détail de la procédure';
        procedureDetailTitle.textContent = selectedTitle;

        if (procedureThumbnail && procedureThumbnailButton) {
            const imageSrc = card.dataset.procedureImage;
            if (imageSrc) {
                procedureThumbnail.src = imageSrc;
                procedureThumbnail.alt = selectedTitle;
                procedureThumbnailButton.dataset.fullsrc = imageSrc;
                procedureThumbnailButton.classList.remove('hidden');
            } else {
                procedureThumbnailButton.classList.add('hidden');
            }
        }

        procedureDetailContent.innerHTML = proceduresDetailMap[selectedTitle] || '<p class="card-text">Description à compléter.</p>';
        procedureDetailCard.classList.remove('hidden');
        procedureDetailCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const procedureButtons = document.querySelectorAll('.procedure-open');
    procedureButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const card = this.closest('.procedure-card');
            openProcedureDetail(card);
        });
    });

    if (closeProcedureDetail) {
        closeProcedureDetail.addEventListener('click', function () {
            if (procedureDetailCard) {
                procedureDetailCard.classList.add('hidden');
            }
        });
    }

    // ===============================
    // Navigation type SPA (sans scroll)
    // ===============================

    allNavLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            const targetId = normalizeId(this.getAttribute('href'));
            if (!targetId) return;

            showSectionById(targetId);

            // Fermer le menu horizontal sur mobile après clic
            if (window.innerWidth <= 768 && mainNav && navToggle) {
                mainNav.classList.remove('open');
                navToggle.classList.remove('open');
            }
        });
    });

// ===============================
// Navigation au scroll + clavier (améliorée)
// - Scroll bas  => section suivante
// - Scroll haut => section précédente
// Ordre basé sur la SIDEBAR
// ===============================

const sectionOrder = Array.from(sidebarLinks)
    .map(link => normalizeId(link.getAttribute('href')))
    .filter(Boolean);

let navLocked = false;
const NAV_LOCK_MS = 650;

function lockNavBriefly() {
    navLocked = true;
    setTimeout(() => (navLocked = false), NAV_LOCK_MS);
}

function getActiveSectionEl() {
    return document.querySelector('.section-page.active-section');
}

function getActiveSectionId() {
    const el = getActiveSectionEl();
    return el ? el.id : (sectionOrder[0] || 'accueil');
}

function goToSectionByIndex(index, options) {
    if (index < 0 || index >= sectionOrder.length) return;
    showSectionById(sectionOrder[index], options);
}

function goToByDelta(delta) {
    const currentId = getActiveSectionId();
    const index = sectionOrder.indexOf(currentId);
    if (index === -1) return;
    goToSectionByIndex(index + delta);
}

function elementCanScroll(el) {
    return el && el.scrollHeight > el.clientHeight + 20;
}

function isAtTop(el) {
    return !el || el.scrollTop <= 2;
}

function isAtBottom(el) {
    return !el || (el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
}

// Détermine quel élément scrolle réellement :
// - si la section active est en overflow auto/scroll => elle
// - sinon => le document (page)
function getPrimaryScroller() {
    const active = getActiveSectionEl();
    const docScroller = document.scrollingElement || document.documentElement;

    if (!active) return docScroller;

    const overflowY = window.getComputedStyle(active).overflowY;
    const sectionIsScrollable =
        (overflowY === 'auto' || overflowY === 'scroll') && elementCanScroll(active);

    return sectionIsScrollable ? active : docScroller;
}

// Ignore les interactions si on est en train d’écrire (formulaire / champs)
function isTypingTarget(target) {
    if (!target) return false;
    const tag = target.tagName ? target.tagName.toLowerCase() : '';
    return tag === 'input' || tag === 'textarea' || target.isContentEditable;
}

// Laisser scroller une zone interne (ex: procédures) tant qu'elle n'est pas aux extrémités
function shouldLetInnerScroll(target, directionDown) {
    const inner = target.closest('.bts-procedures-list');
    if (!inner) return false;
    if (!elementCanScroll(inner)) return false;

    if (directionDown) return !isAtBottom(inner);
    return !isAtTop(inner);
}

window.addEventListener('wheel', function (event) {
    if (navLocked) return;
    if (isTypingTarget(event.target)) return;

    const directionDown = event.deltaY > 0;

    // 1) laisser scroller les listes internes (procédures) si elles le peuvent
    if (shouldLetInnerScroll(event.target, directionDown)) return;

    // 2) utiliser le bon conteneur de scroll (section ou page)
    const scroller = getPrimaryScroller();
    if (!scroller) return;

    // 3) si on peut encore scroller dans la direction, on laisse faire
    if (elementCanScroll(scroller)) {
        if (directionDown && !isAtBottom(scroller)) return;
        if (!directionDown && !isAtTop(scroller)) return;
    }

    // 4) sinon on change de section
    event.preventDefault();
    goToByDelta(directionDown ? 1 : -1);
    lockNavBriefly();
}, { passive: false });

// ===============================
// Navigation clavier
// - ↑/↓ : section précédente/suivante
// - PageUp/PageDown : idem
// - Home/End : première/dernière section
// - Space : suivante | Shift+Space : précédente
// ===============================

window.addEventListener('keydown', function (event) {
    if (navLocked) return;
    if (isTypingTarget(event.target)) return;

    const key = event.key;

    const nextKeys = new Set(['ArrowDown', 'PageDown', ' ']); // espace
    const prevKeys = new Set(['ArrowUp', 'PageUp']);

    // Space + Shift => précédent
    const isSpace = key === ' ';
    const wantsPrev = isSpace ? event.shiftKey : prevKeys.has(key);
    const wantsNext = isSpace ? !event.shiftKey : nextKeys.has(key);

    if (!wantsPrev && !wantsNext && key !== 'Home' && key !== 'End') return;

    event.preventDefault();

    if (key === 'Home') {
        goToSectionByIndex(0);
        lockNavBriefly();
        return;
    }

    if (key === 'End') {
        goToSectionByIndex(sectionOrder.length - 1);
        lockNavBriefly();
        return;
    }

    goToByDelta(wantsNext ? 1 : -1);
    lockNavBriefly();
});

// ===============================
// BTS : tableau 3 colonnes sous les cartes
// ===============================

const btsTableWrap  = document.getElementById('btsTableWrap');
const btsTableTitle = document.getElementById('btsTableTitle');
const btsTableGrid  = document.getElementById('btsTableGrid');
const btsCards = document.querySelectorAll('.bts-card[data-bloc]');

async function ensureProceduresLoaded(card) {
  const list = card.querySelector('.bts-procedures-list[data-src]');
  if (!list) return null;

  if (list.dataset.loaded === 'true') return list;

  const src = list.getAttribute('data-src');
  if (!src) return list;

  try {
    const res = await fetch(src, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    list.innerHTML = await res.text();
    list.dataset.loaded = 'true';
  } catch (err) {
    console.error('Impossible de charger', src, err);
    list.innerHTML = `<div class="bts-load-error">Erreur de chargement des procédures.</div>`;
    list.dataset.loaded = 'true';
  }

  return list;
}

function renderTableFromList(list) {
  if (!btsTableWrap || !btsTableGrid) return;

  const procedures = list ? list.querySelectorAll('.procedure-card') : [];
  btsTableGrid.innerHTML = Array.from(procedures).map(proc => {
    const titleEl = proc.querySelector('.procedure-title');
    const linkEl  = proc.querySelector('.procedure-download');

    const title = titleEl ? titleEl.textContent.trim() : 'Procédure';
    const href  = linkEl ? linkEl.getAttribute('href') : '#';

    return `
      <div class="bts-cell">
        <div class="cell-title">${escapeHtml(title)}</div>
        <a class="btn btn-ghost btn-small procedure-download" href="${escapeHtml(href)}">Télécharger</a>
      </div>
    `;
  }).join('');

  btsTableWrap.classList.add('is-visible');
  btsTableWrap.setAttribute('aria-hidden', 'false');

  // Ramener le tableau dans la vue (sinon il peut être sous les cartes)
  btsTableWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

btsCards.forEach(card => {
  card.addEventListener('click', async () => {
    const isVisible = btsTableWrap && btsTableWrap.classList.contains('is-visible');
    if (isVisible && openedBtsCard === card) {
      closeBtsTable();
      return;
    }

    const bloc = card.getAttribute('data-bloc') || '';
    if (btsTableTitle) btsTableTitle.textContent = `Procédures – Bloc ${bloc}`;

    const list = await ensureProceduresLoaded(card);
    renderTableFromList(list);

    document.querySelectorAll('.bts-card.is-selected').forEach(c => c.classList.remove('is-selected'));
    card.classList.add('is-selected');
    openedBtsCard = card;
  });
});

    const imageModal = document.getElementById('imageModal');
    const imageModalImg = document.getElementById('imageModalImg');
    const imageModalClose = document.getElementById('imageModalClose');
    const imageModalBackdrop = document.getElementById('imageModalBackdrop');

    function closeImageModal() {
        if (!imageModal) return;
        imageModal.classList.add('hidden');
        imageModal.setAttribute('aria-hidden', 'true');
        if (imageModalImg) {
            imageModalImg.src = '';
            imageModalImg.alt = '';
        }
    }

    document.querySelectorAll('.placeholder-image-button').forEach(button => {
        button.addEventListener('click', function () {
            if (!imageModal || !imageModalImg) return;
            const fullsrc = this.dataset.fullsrc;
            const alt = this.querySelector('img')?.alt || '';
            imageModalImg.src = fullsrc;
            imageModalImg.alt = alt;
            imageModal.classList.remove('hidden');
            imageModal.setAttribute('aria-hidden', 'false');
        });
    });

    if (imageModalClose) {
        imageModalClose.addEventListener('click', closeImageModal);
    }

    if (imageModalBackdrop) {
        imageModalBackdrop.addEventListener('click', closeImageModal);
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeImageModal();
        }
    });

// Empêcher les clics internes (boutons / liste scrollable) de re-déclencher le clic carte
document.addEventListener('click', (e) => {
  if (e.target.closest('.procedure-download') || e.target.closest('.bts-procedures-list')) {
    e.stopPropagation();
  }
}, true);
})