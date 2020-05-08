# Project Proposal 
### What problem are you solving?
As text messaging becomes one of the most popular mediums of communication, there are more attackers trying to obtain private data from the end-users of the messaging systems. With the prevalence of private information being exchanged through messaging apps it is imperative that the data transferred through these messaging apps be protected to ensure private communication. For this project, we try to explore ways to build an end-to-end encrypted messaging system to protect user data.

### Why is it important?
Data transferred between individuals through text messaging also continues to grow as more and more information is exchanged between individuals. Among these messages, there are bound to be messages that are extremely private and if these messages are not protected then individuals with malicious intent may intercept and expose this information. Many users are unaware of this potential violation of the privacy of the users of such text messaging applications. The information intercepted is often used against these users in phishing attempts, credit card scams, blackmailing, etc. Therefore, providing a safe platform for users to be able to send messages without leaking any information is important.

### What do you plan to build?
A web-based live chatting(without login) application with end-to-end encryption (TLS), in which none of the messages are sent as plain text. We assume that the database we use is secure. 

### What are your expected results?
Our result should be a fully functional web application that supports end-to-end encrypted messaging between two users. When we intercept a packet sent through the messaging application, the content of the message should not be interpretable.
