# BinaryFantasyFS
Repository for the codebase of the group Binary Fantasy on the project Family Share (Ca Foscari)

# Passi da seguire
Scaricate mongoDB e fatelo partire (seguite la documentazione ufficiale).
In aggiunta scaricate (opzionale) la GUI Compass per gestire anche graficamente il database.
Dopo aver verificato lo stato della connessione (deve essere attiva), npm start per la parte backend e npm start lato client.


# GUIDA DETTAGLIATA

# STEP 1
Aprire cmd e lanciare questo comando
“C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe”
Lasciate aperta la console in background.

# STEP 2
Aprire Visual Studio Code, dando per scontato che abbiate gia’ scaricato dalla nostra
repository e quindi abbiate il progetto mappato e collegato a github, fate questi step:
andate sul file .env.sample del backend
togliete il .sample di modo che il file si chiami .env 

# STEP 3
Sempre dentro a VSCode aprite la cartella client e anche qui fate la stessa cosa di prima
rinominate il file .env.sample in .env e metteteci dentro questo

# STEP 4
Fatto cio’ aprite un terminale in VSCode (in alto c’e una voce Terminal > New Terminal) e
poi una volta che nella parte inferiore dello schermo si apre il terminale selezionate come da
immagine Split terminal > Powershell

# STEP 5
A voi scegliere dove avere il backend e dove il frontend ma la procedura e’ la stessa.
Su entrambi cd pbinary.
Su un terminale fate cd client/src (questo sara’ il vostro frontend).
Sull’altro terminale fate banalmente cd src (questo sara’ il vostro backend).
Ora su entrambi fate npm i, questo installera’ tutti i pacchetti npm di cui avete bisogno.
Una volta che entrambi hanno finito, sempre su entrambi i terminali, scrivete npm start,
PRIMA VA FATTO PARTIRE IL BACKEND

# STEP 6
Good luck have fun.

# STEP 7 BONUS
Ogni volta per far partire l’applicazione dovete fare il cmd e lasciarlo aperto dello STEP 1, e
dividere il terminale in due e lanciare solamente questa volta npm start , poiche’ i pacchetti
npm li avete gia’ installati. Ricordatevi di far partire prima il backend.
