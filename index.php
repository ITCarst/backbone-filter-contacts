<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <title>Backbone.js Web App</title>
        <link rel="stylesheet" href="css/screen.css" />
    </head>
    <body>


        <div class="flex-container" id="content">

            <header role="banner">Header</header>

            <main class="flex-container flex-content">
                <div class="add-contact">

                    <a id="showForm" href="#">Add new Contact</a>

                    <div>
                        Add Contact:<br/>
                        <form id="addContact" action="#">
                            <label for="photo">Photo:</label><br/>
                            <input id="photo" type="file"/>

                            <label for="type">Type:</label><br/>
                            <input id="type" type="text"/>

                            <label for="name">Name: </label><br/>
                             <input id="name" type="text"/>

                             <label for="address">Address:</label><br/>
                            <input id="address" type="text"/>

                            <label for="tel">Tel:</label><br/>
                            <input id="tel" type="text"/>

                            <label for="email">Email:</label><br/>
                            <input id="email" type="text"/>

                            <button id="add">Add</button>

                        </form>
                    </div>
                </div>

                <nav class="mailbox-list">
                     <div id="filter"><label>Show me: </label></div>
                </nav>

                <article class="message">
                    <div id="contacts">
                        <script id="contactTemplate" type="text/template">
                            <img src="<%= photo %>" alt="<%= name %>" />
                            <h1><%= name %><span><%= type %></span></h1>
                            <div> <%= address %></div>
                            <button class="delete">Delete</button>
                            <button class="edit">Edit</button>
                            <dl>
                                <dt>Tel: <%= tel %></dt>
                                <dd>Email: <%= email %></dd>
                            </dl>
                        </script>
                        <script id="contactEditTemplate" type="text/template">
                            <form action="#">
                                <input type="file" value="<%= photo %>" />
                                <input class="name" value ="<%= name %>" />
                                <input id="type" type="hidden" value="<%= type %>" />
                                <input class="address" value="<%= address %>" />
                                <input class="tel" value="<%= tel %>" />
                                <input class="email" value="<%= email %>" />
                                <button class="save">Save</button>
                                <button class="cancel"> Cancel</button>
                            </form>
                        </script>
                 </div>
                </article>
            </main>

            <footer id="footer">
                 <ul>
                     <script id="footerTemplate" type="text/template">
                         <%= name %>
                    </script>
                </ul>
            </footer>

        </div>

        <script src="js/node_modules/jquery/dist/jquery.min.js"></script>
        <script src="js/node_modules/underscore/underscore-min.js"></script>
        <script src="js/node_modules/backbone/backbone-min.js"></script>
        <script src="js/app.js"></script>
    </body>
</html>


