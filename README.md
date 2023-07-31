# AjoT-Parcking
Questa repository rappresenta il Back-End e il Front-end di un parcheggio intelligente. 
La parte che invece riguarda il microcontrollore è disponibile a questa repository: https://github.com/Yagotzirck/AjoT-Parking_Arduino

Per quanto riguarda il front-end e il back-end prima di tutto occorre:  <br />
1.	Installare l’ultima versione di Node.js da https://nodejs.org <br />
Dopo aver scaricato il progetto, posizionarsi da linea di comando sulla directory e seguire i seguenti passaggi: <br />
2.	Procedere con l’installazione di Ionic con il seguente comando **npm install -g @ionic/cli** <br />
3.  Installare tutte le librerie presenti nel package.json con il comando **npm install** <br />
4.   Ricercare all’interno della directory principale il file .env e inserire tutti i parametri di accesso necessari per AWS <br />
5.   Per avviare il server del back-end lanciare il comando **node server.js** <br />
6.   Per aviare il web server, aprire un’altra shell aperta sempre nella directory e utilizzare il comando **ionic serve**, quando ha finito apre in automatico il browser posizionandosi all’indirizzo http://localhost:8000/ oppure http://127.0.0.1:8000/ <br />
