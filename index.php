<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <title>Backbone.js Web App</title>
        <link rel="stylesheet" href="dist/screen.min.css" />
    </head>
    <body>

        <div class="flex-container" id="content">
            <header role="banner">Header</header>
            <main class="flex-container flex-content">
                <div class="add-contact">
                    <a id="showForm" href="#">Add new Contact:</a>
                    <div>
                        <form id="addContact" action="#">
                            <label for="photo">Photo:</label>
                            <input id="photo" type="file"/>

                            <label for="type">Type:</label>
                            <input id="type" type="text"/>

                            <label for="name">Name: </label>
                             <input id="name" type="text"/>

                             <label for="address">Address:</label>
                            <input id="address" type="text"/>

                            <label for="tel">Tel:</label>
                            <input id="tel" type="text"/>

                            <label for="email">Email:</label>
                            <input id="email" type="text"/>

                            <button id="add">Add</button>

                        </form>
                    </div>
                </div>

                <nav class="mailbox-list">
                     <div id="filter"><label>Filter By: </label></div>
                </nav>

                <article class="message" id="contacts">
                    <script id="contactTemplate" type="text/template"></script>
                    <script id="contactEditTemplate" type="text/template"></script>
                </article>
            </main>

            <footer id="footer">
                <ul></ul>
            </footer>
        </div>
        <!-- <script data-main="js/app/main.js" src="js/libs/require.min.js"></script> -->
        <script data-main="dist/main.min.js" src="js/libs/require.min.js"></script>
    </body>
</html>


