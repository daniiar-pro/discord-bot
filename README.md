data/messages.db (congrulatory texts)
Message template from the database
reusable piece of text that you can re-use
"You nailed it", "You did it, I knew you could"


1. Get triggered by a request
2. Fetch random GIF 
3. Retrieve random message template from data/messages.db (above mentioned)
4. Retrieve a sprint title from data/spint_titles WD-1.1 = OOP Python when user sends name and sprint_id = WD-1.1:
                    Bot: 
                        1. Gets triggered by a request
                        2. Fetch GIF
                        3. Retrieves random message from template db
                        4. retrieve sprint title from data which matches WD-1.1 (sprint_id) = OOP Python
                        5. Congrulate a user on a configured Discord server with the Gif and a message (same as "accomplishments" channel)
                        6. For each user store the congratulatory message and valuable metadata in the database so that it can be retrieved later

                        7. On failure, inform the user that the congratulatory message could not be formed/sent/stored