(function () {
  'use strict';

  var STORAGE_KEY = 'cerebro_lang';
  var VALID_LANGS = ['el', 'en'];

  // ─── Translation Dictionary ───────────────────────────────────────────────

  var translations = {

    el: {
      // Meta
      'meta.title':       'Cerebro Software — Αυτοματισμός AI & Ψηφιακές Λύσεις',
      'meta.description': 'Η Cerebro Software κατασκευάζει custom συστήματα αυτοματισμού AI και ψηφιακές λύσεις για επιχειρήσεις σε όλη την Ελλάδα.',

      // Nav
      'nav.services':   'Υπηρεσίες',
      'nav.products':   'Προϊόντα',
      'nav.about':      'Σχετικά',
      'nav.contact':    'Επικοινωνία',
      'nav.menu.aria':  'Μενού',
      'nav.lang.aria':  'Εναλλαγή γλώσσας',

      // Hero overline & side label
      'hero.overline':        'ΑΥΤΟΜΑΤΙΣΜΟΣ AI & ΨΗΦΙΑΚΕΣ ΛΥΣΕΙΣ',
      'hero.side.label':      'ΑΥΤΟΜΑΤΙΣΜΟΣ AI · ΨΗΦΙΑΚΕΣ ΛΥΣΕΙΣ · ΛΟΓΙΣΜΙΚΟ',

      // Hero — plain text
      'hero.scene1.eyebrow':  'Νοημοσύνη Αυτοματισμού',
      'hero.scene1.headline': 'Αυτοματοποιούμε ό,τι σας καθυστερεί.',
      'hero.scene2.sub':      'Κατασκευασμένο στην Κρήτη. Αναπτυγμένο σε όλη την Ελλάδα.',
      'hero.progress.scroll': 'Scroll',

      // Hero — HTML (preserves .hw spans for GSAP word-reveal)
      'hero.scene0.headlineHtml': '<span class="hw">Η</span> <span class="hw">νοημοσύνη</span> <span class="hw">πίσω</span> <span class="hw">από</span><br><span class="hw">έξυπνα</span> <span class="hw">συστήματα.</span>',
      'hero.scene1.headlineHtml': '<span class="hw">Αυτοματοποιούμε</span><br><span class="hw">ό,τι σας καθυστερεί.</span>',
      'hero.scene2.headlineHtml': '<span class="hw">Συστήματα</span> <span class="hw">AI</span><br><span class="hw">για</span> <span class="hw">πραγματικές</span><br><span class="hw">επιχειρήσεις.</span>',
      'hero.scene3.headlineHtml': '<span class="hw">CEREBRO</span><br><span class="hw">SOFTWARE.</span>',

      // Mission
      'mission.eyebrow':  'Τι κάνουμε',
      'mission.headline': 'Εντοπίζουμε τα προβλήματα που σας κοστίζουν χρόνο και χρήμα. Έπειτα τα εξαλείφουμε.',
      'mission.body':     'Η Cerebro Software κατασκευάζει custom συστήματα αυτοματισμού AI και ψηφιακές λύσεις για μικρομεσαίες επιχειρήσεις σε όλη την Ελλάδα. Δεν πουλάμε templates. Σχεδιάζουμε εργαλεία ακριβείας που τρέχουν τις λειτουργίες σας ενώ εσείς επικεντρώνεστε στην ανάπτυξη.',

      // Services
      'services.eyebrow':   'Τι προσφέρουμε',
      'services.headline':  'Δύο κατευθύνσεις.<br>Μία νοημοσύνη.',
      'services.s1.title':  'Ψηφιακές Λύσεις',
      'services.s1.desc':   'Επαγγελματικά websites και ψηφιακή παρουσία για επιχειρήσεις που θέλουν να ξεχωρίζουν και να φέρνουν αποτελέσματα. Κατασκευασμένα με ακρίβεια, όχι με templates.',
      'services.s1.feat1':  'Σχεδιασμός & ανάπτυξη custom website',
      'services.s1.feat2':  'Ψηφιακή παρουσία επιχείρησης',
      'services.s1.feat3':  'E-commerce & συστήματα κρατήσεων',
      'services.s1.feat4':  'Brand identity & οπτικά συστήματα',
      'services.s1.cta':    'Ξεκινήστε ένα project →',
      'services.s2.title':  'Αυτοματισμός AI',
      'services.s2.desc':   'Χαρτογραφούμε τις διαδικασίες σας, εντοπίζουμε τα σημεία καθυστέρησης και κατασκευάζουμε έξυπνα συστήματα που λειτουργούν ανεξάρτητα. Πραγματικός αυτοματισμός, όχι απλά chatbot demos.',
      'services.s2.feat1':  'Custom αυτοματισμός AI workflows',
      'services.s2.feat2':  'Email intelligence & αυτόματη απάντηση',
      'services.s2.feat3':  'Επεξεργασία & αναγνώριση εγγράφων',
      'services.s2.feat4':  'AI voice & chat agents',
      'services.s2.cta':    'Εξερευνήστε τον αυτοματισμό →',

      // Products
      'products.eyebrow':   'Λογισμικά Προϊόντα',
      'products.headline':  'Εργαλεία για πραγματική λειτουργία.<br>Έτοιμα σε λίγες μέρες.',
      'products.p1.desc':   'Παρακολουθεί τα εισερχόμενά σας, αναγνωρίζει PDF έγγραφα μέσω λέξεων-κλειδιών και στέλνει μαζικά τιμολόγια αυτόματα μέσω Outlook, Gmail ή οποιουδήποτε λογαριασμού SMTP.',
      'products.p1.feat1':  'Παρακολούθηση εισερχομένων & αναγνώριση PDF',
      'products.p1.feat2':  'Μαζική αποστολή μέσω Outlook / Gmail / SMTP',
      'products.p1.feat3':  'Περιβάλλον drag & drop, dark mode',
      'products.p1.feat4':  'Εξαγωγή Excel & αδειοδότηση HWID',
      'products.p1.feat5':  'Αυτόματη ενημέρωση μέσω GitHub',
      'products.p1.period': '/έτος',
      'products.p1.cta':    'Αίτηση Άδειας',
      'products.p2.desc':   'Email intelligence με AI, εκπαιδευμένο στη γνωσιακή βάση της επιχείρησής σας. Διαβάζει, κατανοεί και συντάσσει ακριβείς απαντήσεις στο ύφος σας — αυτόματα ή ως πρόταση.',
      'products.p2.feat1':  'Δημιουργία απαντήσεων με Claude AI',
      'products.p2.feat2':  'Υποστήριξη Gmail + Outlook IMAP/SMTP',
      'products.p2.feat3':  'Auto Mode & Suggest Mode',
      'products.p2.feat4':  'Ανίχνευση προτεραιότητας & ανάλυση συναισθήματος',
      'products.p2.feat5':  'Εβδομαδιαίες αναφορές, multi-inbox, φιλτράρισμα spam',
      'products.p2.period': '/μήνα',
      'products.p2.note':   'API included',
      'products.p2.cta':    'Αίτηση Άδειας',
      'products.tag.businesses': 'Επιχειρήσεις',

      // Method
      'method.eyebrow':  'Η Μέθοδός Μας',
      'method.headline': 'Από το πρόβλημα<br>στο σύστημα.',
      'method.intro':    'Δεν ξεκινάμε από τα εργαλεία. Ξεκινάμε από τα σημεία όπου η επιχείρησή σας χάνει χρόνο, χρήματα ή έλεγχο και δημιουργούμε το σύστημα που κάνει τη λειτουργία σας πιο απλή, γρήγορη και αποδοτική.',
      'method.c1.title': 'Εντοπίζουμε',
      'method.c1.text':  'Εντοπίζουμε τα σημεία καθυστέρησης, τις επαναλαμβανόμενες εργασίες και τα κενά που δυσκολεύουν την καθημερινή λειτουργία σας.',
      'method.c2.title': 'Σχεδιάζουμε',
      'method.c2.text':  'Σχεδιάζουμε τη σωστή ροή, το κατάλληλο περιβάλλον και τη λογική αυτοματισμού γύρω από τον τρόπο που λειτουργεί πραγματικά η επιχείρησή σας.',
      'method.c3.title': 'Παραδίδουμε',
      'method.c3.text':  'Παραδίδουμε ένα λειτουργικό σύστημα με υποστήριξη, ενημερώσεις και δυνατότητα εξέλιξης όσο μεγαλώνουν οι ανάγκες σας.',
      'method.s1.title': 'Εντοπίζουμε',
      'method.s1.text':  'Εντοπίζουμε τα σημεία καθυστέρησης, τις επαναλαμβανόμενες εργασίες και τα κενά που δυσκολεύουν την καθημερινή λειτουργία σας.',
      'method.s2.title': 'Σχεδιάζουμε',
      'method.s2.text':  'Σχεδιάζουμε τη σωστή ροή, το κατάλληλο περιβάλλον και τη λογική αυτοματισμού γύρω από τον τρόπο που λειτουργεί πραγματικά η επιχείρησή σας.',
      'method.s3.title': 'Παραδίδουμε',
      'method.s3.text':  'Παραδίδουμε ένα λειτουργικό σύστημα με υποστήριξη, ενημερώσεις και δυνατότητα εξέλιξης όσο μεγαλώνουν οι ανάγκες σας.',

      // Why Cerebro
      'why.headline': 'Γιατί\nCerebro;',
      'why.i1.title': 'Κατασκευάζουμε, δεν συμβουλεύουμε.',
      'why.i1.text':  'Κάθε λύση κατασκευάζεται custom για τη δική σας λειτουργία — όχι template, όχι plugin, όχι SaaS συνδρομή που δεν χρειάζεστε.',
      'why.i2.title': 'Εμπειρία στην ελληνική αγορά.',
      'why.i2.text':  'Βρισκόμαστε στο Ηράκλειο Κρήτης. Γνωρίζουμε το τοπικό επιχειρηματικό τοπίο, τη γλώσσα και τα πραγματικά προβλήματα που αντιμετωπίζουν οι ελληνικές ΜΜΕ κάθε μέρα.',
      'why.i3.title': 'AI που πραγματικά λειτουργεί.',
      'why.i3.text':  'Παραδίδουμε συστήματα έτοιμα για παραγωγή, όχι demos. Ο αυτοματισμός σας λειτουργεί από την πρώτη μέρα, με αδειοδότηση, ενημερώσεις και υποστήριξη.',
      'why.i4.title': 'Διαφανής τιμολόγηση.',
      'why.i4.text':  'Χωρίς κρυφές χρεώσεις. Σαφή πακέτα με εκ των προτέρων κόστη, μηνιαίες τιμές και τα πάντα τεκμηριωμένα πριν υπογράψετε οτιδήποτε.',
      'why.typewriter.1': 'Επειδή δεν πουλάμε templates.',
      'why.typewriter.2': 'Επειδή το AI που φτιάχνουμε δουλεύει.',
      'why.typewriter.3': 'Επειδή μετράμε αποτελέσματα, όχι ώρες.',
      'why.typewriter.4': 'Επειδή automation δεν σημαίνει απλοποίηση — σημαίνει ακρίβεια.',

      'contact.swap.1': 'ευφυές.',
      'contact.swap.2': 'αποδοτικό.',
      'contact.swap.3': 'ακριβές.',
      'contact.swap.4': 'δικό σας.',

      // Contact
      'contact.eyebrow': 'Επικοινωνήστε μαζί μας',
      'contact.headline.line1': 'Ας μιλήσουμε για',
      'contact.headline.line2': 'κάτι',
      'contact.intro':    'Πείτε μας για την επιχείρησή σας και το πρόβλημα που θέλετε να λύσετε. Θα απαντήσουμε εντός 24 ωρών.',
      'contact.hint':     'Κάντε κλικ για αντιγραφή',

      // Form
      'form.name.label':          'Όνομα',
      'form.name.placeholder':    'Το όνομά σας',
      'form.email.label':         'Email',
      'form.email.placeholder':   'email@company.com',
      'form.business.label':      'Τύπος επιχείρησης',
      'form.business.opt0':       'Επιλέξτε επιχείρηση',
      'form.business.opt1':       'Ξενοδοχείο / Τουρισμός',
      'form.business.opt2':       'Ιατρείο / Κλινική',
      'form.business.opt3':       'Άλλη επιχείρηση',
      'form.message.label':       'Τι χρειάζεστε;',
      'form.message.placeholder': 'Περιγράψτε την κατάστασή σας και τι θα θέλατε να αυτοματοποιήσουμε ή να δημιουργήσουμε...',
      'form.submit':              'Αποστολή →',

      // Reel overlay
      'reel.btn':    'Δείτε πώς λειτουργεί',
      'reel.c1':     '01 / Χάος στη λειτουργία',
      'reel.c2':     '02 / Αναγνώριση μοτίβων',
      'reel.c3':     '03 / Συνδεδεμένος αυτοματισμός',
      'reel.c4':     '04 / Έξυπνος έλεγχος',
      'reel.end.sub':'Συστήματα πίσω από πιο έξυπνες επιχειρήσεις.',
      'reel.replay': 'Αναπαραγωγή',

      // Footer
      'footer.statement':    'Ας δημιουργήσουμε το<br>σύστημα που χρειάζεται<br>η επιχείρησή σας.',
      'footer.col1.label':   'Κύρια',
      'footer.col1.services': 'Υπηρεσίες',
      'footer.col1.products': 'Προϊόντα',
      'footer.col1.medical':  'Ιατρικός Αυτοματισμός',
      'footer.col1.contact':  'Επικοινωνία',
      'footer.col2.label':    'Περισσότερα',
      'footer.col2.about':    'Σχετικά με Cerebro',
      'footer.col2.automation': 'Αυτοματισμός AI',
      'footer.col2.solutions':  'Ψηφιακές Λύσεις',
      'footer.col3.label':    'Προϊόντα',
      'footer.col4.label':    'Ξεκινήστε',

      // Preloader / accessibility
      'preloader.aria':      'Φόρτωση Cerebro Software',
      'preloader.location':  'Ηράκλειο, Κρήτη — Ελλάδα',

      // Hero meta
      'hero.meta.location':  'Ηράκλειο, Κρήτη',

      // Footer credits
      'footer.credits.location': 'Ηράκλειο, Κρήτη — Ελλάδα',
      'footer.credits.tagline':  'Αυτοματισμός AI & Ψηφιακές Λύσεις',
    },

    en: {
      // Meta
      'meta.title':       'Cerebro Software — AI Automation & Digital Solutions',
      'meta.description': 'Cerebro Software — AI Automation & Digital Solutions for businesses in Greece. Custom AI systems, websites, and software products.',

      // Nav
      'nav.services':  'Services',
      'nav.products':  'Products',
      'nav.about':     'About',
      'nav.contact':   'Contact',
      'nav.menu.aria': 'Menu',
      'nav.lang.aria': 'Switch language',

      // Hero overline & side label
      'hero.overline':        'AI Automation & Digital Solutions',
      'hero.side.label':      'AI AUTOMATION · DIGITAL SOLUTIONS · SOFTWARE',

      // Hero — plain text
      'hero.scene1.eyebrow':  'Automation Intelligence',
      'hero.scene1.headline': 'We automate what slows you down.',
      'hero.scene2.sub':      'Built in Crete. Deployed across Greece.',
      'hero.progress.scroll': 'Scroll',

      // Hero — HTML (preserved exactly from index.html)
      'hero.scene0.headlineHtml': '<span class="hw">The</span> <span class="hw">brain</span> <span class="hw">behind</span> <span class="hw">smart</span><br><span class="hw">systems.</span>',
      'hero.scene1.headlineHtml': '<span class="hw">We</span> <span class="hw">automate</span><br><span class="hw">what</span> <span class="hw">slows</span><br><span class="hw">you</span> <span class="hw">down.</span>',
      'hero.scene2.headlineHtml': '<span class="hw">AI</span> <span class="hw">systems</span> <span class="hw">for</span><br><span class="hw">real</span> <span class="hw">businesses.</span>',
      'hero.scene3.headlineHtml': '<span class="hw">CEREBRO</span><br><span class="hw">SOFTWARE.</span>',

      // Mission
      'mission.eyebrow':  'What we do',
      'mission.headline': 'We identify the problems that cost you time and money. Then we eliminate them.',
      'mission.body':     "Cerebro Software builds custom AI automation systems and digital solutions for small and medium businesses across Greece. We don't sell templates. We engineer precision tools that run your operations while you focus on growth.",

      // Services
      'services.eyebrow':  'What we offer',
      'services.headline': 'Two directions.<br>One intelligence.',
      'services.s1.title': 'Digital Solutions',
      'services.s1.desc':  'Professional websites and digital presence for businesses that want to stand out and convert. Built with precision, not templates.',
      'services.s1.feat1': 'Custom website design & development',
      'services.s1.feat2': 'Business digital presence',
      'services.s1.feat3': 'E-commerce & booking systems',
      'services.s1.feat4': 'Brand identity & visual systems',
      'services.s1.cta':   'Start a project →',
      'services.s2.title': 'AI Automation',
      'services.s2.desc':  'We map your workflows, find the bottlenecks, and build intelligent systems that run without you. Real automation, not chatbot demos.',
      'services.s2.feat1': 'Custom AI workflow automation',
      'services.s2.feat2': 'Email intelligence & auto-response',
      'services.s2.feat3': 'Document processing & recognition',
      'services.s2.feat4': 'AI voice & chat agents',
      'services.s2.cta':   'Explore automation →',

      // Products
      'products.eyebrow':   'Software Products',
      'products.headline':  'Built for real operations.\nDeployed in days.',
      'products.p1.desc':   'Monitors your inbox, recognizes agency PDFs by keyword, and sends bulk invoices automatically through Outlook, Gmail, or any SMTP account.',
      'products.p1.feat1':  'Inbox monitoring & PDF recognition',
      'products.p1.feat2':  'Bulk send via Outlook / Gmail / SMTP',
      'products.p1.feat3':  'Drag & drop interface, dark mode',
      'products.p1.feat4':  'Excel export & HWID licensing',
      'products.p1.feat5':  'Auto-update via GitHub',
      'products.p1.period': '/year',
      'products.p1.cta':    'Request License',
      'products.p2.desc':   "AI-powered email intelligence trained on your business knowledge base. Reads, understands, and drafts precise replies in your voice — automatically or on suggestion.",
      'products.p2.feat1':  'Claude AI reply generation',
      'products.p2.feat2':  'Gmail + Outlook IMAP/SMTP support',
      'products.p2.feat3':  'Auto Mode & Suggest Mode',
      'products.p2.feat4':  'Priority detection & sentiment analysis',
      'products.p2.feat5':  'Weekly reports, multi-inbox, spam filtering',
      'products.p2.period': '/month',
      'products.p2.note':   'API included',
      'products.p2.cta':    'Request License',
      'products.tag.businesses': 'Businesses',

      // Method
      'method.eyebrow':  'Our Method',
      'method.headline': 'From the problem<br>to the system.',
      'method.intro':    "We don't start with tools. We start with the points where your business loses time, money or control — and we build the system that makes your operations simpler, faster and more effective.",
      'method.c1.title': 'Diagnose',
      'method.c1.text':  'We identify the bottlenecks, repetitive tasks, and hidden gaps that slow your business down.',
      'method.c2.title': 'Design',
      'method.c2.text':  'We design the right workflow, interface, and automation logic around the way your business actually works.',
      'method.c3.title': 'Deploy',
      'method.c3.text':  'We deliver a working system with support, updates, and the ability to evolve as your needs grow.',
      'method.s1.title': 'We identify',
      'method.s1.text':  'We identify the bottlenecks, repetitive tasks, and hidden gaps that slow your business down.',
      'method.s2.title': 'We design',
      'method.s2.text':  'We design the right workflow, interface, and automation logic around the way your business actually works.',
      'method.s3.title': 'We deliver',
      'method.s3.text':  'We deliver a working system with support, updates, and the ability to evolve as your needs grow.',

      // Why Cerebro
      'why.headline': 'Why\nCerebro?',
      'why.i1.title': 'We build, not consult.',
      'why.i1.text':  "Every solution is custom-engineered for your specific operation — not a template, not a plugin, not a SaaS subscription you didn't need.",
      'why.i2.title': 'Greek market expertise.',
      'why.i2.text':  'Based in Heraklion, Crete. We understand the local business landscape, the language, and the real problems Greek SMBs face every day.',
      'why.i3.title': 'AI that actually runs.',
      'why.i3.text':  'We deploy production-ready systems, not demos. Your automation is operational from day one, with licensing, updates, and support included.',
      'why.i4.title': 'Transparent pricing.',
      'why.i4.text':  'No hidden fees. Clear packages with upfront costs, monthly rates, and everything documented before you sign anything.',
      'why.typewriter.1': 'Because we don\'t sell templates.',
      'why.typewriter.2': 'Because the AI we build actually works.',
      'why.typewriter.3': 'Because we measure results, not hours.',
      'why.typewriter.4': 'Because automation doesn\'t mean simplification — it means precision.',

      'contact.swap.1': 'intelligent.',
      'contact.swap.2': 'efficient.',
      'contact.swap.3': 'precise.',
      'contact.swap.4': 'yours.',

      // Contact
      'contact.eyebrow':  'Get in touch',
      'contact.headline.line1': 'Let\'s talk about',
      'contact.headline.line2': 'something',
      'contact.intro':    "Tell us about your business and the problem you want to solve. We'll respond within 24 hours.",
      'contact.hint':     'Click to copy',

      // Form
      'form.name.label':          'Name',
      'form.name.placeholder':    'Your name',
      'form.email.label':         'Email',
      'form.email.placeholder':   'email@company.com',
      'form.business.label':      'Business type',
      'form.business.opt0':       'Select your business',
      'form.business.opt1':       'Hotel / Tourism',
      'form.business.opt2':       'Medical Clinic',
      'form.business.opt3':       'Other Business',
      'form.message.label':       'What do you need?',
      'form.message.placeholder': "Describe your situation and what you'd like to automate or build...",
      'form.submit':              'Send Message →',

      // Reel overlay
      'reel.btn':    'View the system',
      'reel.c1':     '01 / Workflow chaos',
      'reel.c2':     '02 / Pattern detection',
      'reel.c3':     '03 / Connected automation',
      'reel.c4':     '04 / Intelligent control',
      'reel.end.sub':'Systems behind smarter businesses.',
      'reel.replay': 'Replay',

      // Footer
      'footer.statement':     "Let's build the system<br>your business is missing.",
      'footer.col1.label':    'Primary',
      'footer.col1.services': 'Services',
      'footer.col1.products': 'Products',
      'footer.col1.medical':  'Medical Automation',
      'footer.col1.contact':  'Contact',
      'footer.col2.label':    'Go Deeper',
      'footer.col2.about':    'About Cerebro',
      'footer.col2.automation': 'AI Automation',
      'footer.col2.solutions':  'Digital Solutions',
      'footer.col3.label':    'Products',
      'footer.col4.label':    'Start',

      // Preloader / accessibility
      'preloader.aria':      'Loading Cerebro Software',
      'preloader.location':  'Heraklion, Crete — Greece',

      // Hero meta
      'hero.meta.location':  'Heraklion, Crete',

      // Footer credits
      'footer.credits.location': 'Heraklion, Crete — Greece',
      'footer.credits.tagline':  'AI Automation & Digital Solutions',
    }
  };

  // ─── Core API ─────────────────────────────────────────────────────────────

  function getCurrentLang() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && VALID_LANGS.indexOf(saved) !== -1) return saved;
    return 'el';
  }

  function setLanguage(lang) {
    if (VALID_LANGS.indexOf(lang) === -1) return;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    applyTranslations();
    setTimeout(function() {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 400);
  }

  function t(key) {
    var lang = getCurrentLang();
    if (translations[lang] && translations[lang][key] !== undefined) {
      return translations[lang][key];
    }
    if (translations['en'] && translations['en'][key] !== undefined) {
      return translations['en'][key];
    }
    return key;
  }

  // ─── Updaters ─────────────────────────────────────────────────────────────

  function updateMeta() {
    document.title = t('meta.title');
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', t('meta.description'));
  }

  function updateAriaLabels() {
    var els = document.querySelectorAll('[data-i18n-aria]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n-aria');
      if (key) els[i].setAttribute('aria-label', t(key));
    }
  }

  function updatePlaceholders() {
    var els = document.querySelectorAll('[data-i18n-placeholder]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n-placeholder');
      if (key) els[i].setAttribute('placeholder', t(key));
    }
  }

  function updateHTMLTranslations() {
    // Plain text nodes
    var textEls = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < textEls.length; i++) {
      var key = textEls[i].getAttribute('data-i18n');
      if (key) textEls[i].textContent = t(key);
    }
    // HTML nodes (e.g. headings with <br> or <em>)
    var htmlEls = document.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmlEls.length; j++) {
      var hkey = htmlEls[j].getAttribute('data-i18n-html');
      if (hkey) htmlEls[j].innerHTML = t(hkey);
    }
  }

  function updateLanguageSwitcherState() {
    var lang = getCurrentLang();
    var btns = document.querySelectorAll('[data-lang-btn]');
    for (var i = 0; i < btns.length; i++) {
      var btnLang = btns[i].getAttribute('data-lang-btn');
      var isActive = btnLang === lang;
      if (isActive) {
        btns[i].classList.add('lang-btn--active');
        btns[i].setAttribute('aria-pressed', 'true');
      } else {
        btns[i].classList.remove('lang-btn--active');
        btns[i].setAttribute('aria-pressed', 'false');
      }
    }
  }

  function updateHeroHTML() {
    for (var i = 0; i <= 3; i++) {
      var scene = document.querySelector('.hero-scene--' + i);
      if (!scene) continue;
      var headline = scene.querySelector('.hero-headline');
      if (!headline) continue;
      var key = 'hero.scene' + i + '.headlineHtml';
      var html = t(key);
      if (html && html !== key) headline.innerHTML = html;
    }
  }

  // After innerHTML swap, new .hw spans start at CSS opacity:0.
  // Find whichever hero scene GSAP marked visible (inline style.opacity > 0)
  // and restore its words so the active headline stays visible.
  function ensureActiveHeroVisible() {
    if (typeof gsap === 'undefined') return;
    for (var i = 0; i <= 3; i++) {
      var scene = document.querySelector('.hero-scene--' + i);
      if (!scene) continue;
      // GSAP sets inline opacity on scenes after entrance runs.
      // Empty inline opacity means entrance hasn't fired yet — skip.
      if (scene.style.opacity === '') continue;
      if (parseFloat(scene.style.opacity) > 0.5) {
        gsap.set(scene.querySelectorAll('.hw'), { opacity: 1, y: 0 });
      }
    }
  }

  function applyTranslations() {
    updateMeta();
    updateHTMLTranslations();
    updatePlaceholders();
    updateAriaLabels();
    updateLanguageSwitcherState();
    updateHeroHTML();
    ensureActiveHeroVisible();
  }

  // ─── Init ─────────────────────────────────────────────────────────────────

  document.documentElement.lang = getCurrentLang();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTranslations);
  } else {
    applyTranslations();
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  window.CerebroI18n = {
    t: t,
    getCurrentLang: getCurrentLang,
    setLanguage: setLanguage,
    applyTranslations: applyTranslations
  };

}());
