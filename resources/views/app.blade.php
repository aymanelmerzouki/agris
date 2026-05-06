<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Agris</title>
    <script>
        // Appliquer le thème avant le rendu pour éviter le flash
        (function() {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            }
        })();
    </script>
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="bg-gray-50 dark:bg-green-950 text-gray-900 dark:text-green-100 transition-colors duration-300">
    <div id="app"></div>
</body>
</html>
