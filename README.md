# FC25 - Telegram Bot 🤖

## Descrizione 📜

FC25 è un bot Telegram sviluppato per automatizzare alcune operazioni e interagire con gli utenti tramite messaggi. Utilizza Telegram Bot API, gestisce vari comandi e integra Supabase come backend per il salvataggio e la gestione dei dati.

Il bot è configurato per essere facilmente estendibile e personalizzabile, permettendo l'integrazione di nuovi comandi e funzionalità con semplicità.

## Funzionalità ⚙️

- **Gestione comandi Telegram**: Il bot supporta diversi comandi come `/start`, `/help`, ecc.
- **Integrazione con Supabase**: Salvataggio di dati in tempo reale tramite il database Supabase.
- **Gestione errori**: Viene effettuata una gestione avanzata degli errori per garantire un funzionamento robusto.
- **Autenticazione via Telegram**: Utilizza il token Telegram per interagire con gli utenti in modo sicuro.

## Prerequisiti 📋

Per eseguire questo bot, avrai bisogno di:

- Un account Telegram con un bot creato tramite il [BotFather](https://core.telegram.org/bots#botfather).
- Un account Supabase per la gestione dei dati e delle credenziali.

### Variabili d'Ambiente ⚡

Assicurati di impostare le seguenti variabili d'ambiente nel tuo file `.env`:

### Installazione

1. **Clona il repository:**

    ```bash
    git clone https://github.com/tuo_nome_utente/fc-25-bot.git
    cd fc-25-bot
    ```

2. **Installa le dipendenze:**

   Se non hai Node.js installato, [scaricalo qui](https://nodejs.org/). 🌐

   Poi, esegui il comando:

    ```bash
    npm install
    ```

3. **Configura le variabili d'ambiente:**

   Crea un file `.env` nella root del progetto e aggiungi le variabili richieste:

    ```env
    TELEGRAM_BOT_TOKEN=il_tuo_token_telegram
    SUPABASE_URL=https://tuo_url_supabase
    SUPABASE_KEY=la_tua_chiave_api_supabase
    ```

4. **Esegui il bot in locale:**

   Per avviare il bot in locale, usa il comando:

    ```bash
    npm start
    ```

   Questo avvierà il bot e inizierà ad ascoltare i comandi degli utenti su Telegram. 🎧

## Comandi Supportati 🗣️

Il bot supporta i seguenti comandi:

- `/start` - Avvia il bot e mostra un messaggio di benvenuto. 🌟
- `/classifica` - Visualizza la classifica dettagliata. 📊
- `/statistiche` - Mostra le statistiche complete. 📈
- `/inserisci` - Aggiungi un risultato. ➕
- `/saluta` - Un gioioso saluto! 👋
- `/chi_sono` - Scopri chi sono! 👤

## Configurare il Webhook per l'Uso in Remoto 🌍

Per utilizzare il bot in remoto, è necessario configurare un **webhook** che consenta al bot di ricevere messaggi dai server di Telegram. Il webhook è il metodo più efficiente per ricevere aggiornamenti in tempo reale, poiché Telegram invia notifiche al bot ogni volta che un utente invia un messaggio. ⏱️

### Passaggi per configurare il Webhook 🔧

1. **Scegli un server remoto**: Il bot deve essere ospitato su un server remoto (ad esempio, su [Heroku](https://www.heroku.com/), [Vercel](https://vercel.com/), [AWS](https://aws.amazon.com/), o un altro provider) che supporti HTTPS. 🌐

2. **Carica il codice del bot su un server remoto**: Una volta configurato il bot in locale, carica il progetto sul server di tua scelta. 🚀

3. **Configurare il Webhook con Telegram**:
   Una volta che il bot è ospitato su un server remoto, devi configurare il webhook. Per fare ciò, invia una richiesta HTTP al seguente URL di Telegram, sostituendo your_bot_token con il tuo token del bot e your_webhook_url con l'URL del tuo server remoto:

   ```bash
    curl -F "url=https://your-server.com/webhook" https://api.telegram.org/bot<your_bot_token>/setWebhook
   ```
4. **Verifica il Webhook**:   
   Per verificare che il webhook sia stato configurato correttamente, puoi utilizzare il seguente comando:
   ```bash
   curl https://api.telegram.org/bot<your_bot_token>/getWebhookInfo
   ```
   Se la configurazione è corretta, il comando restituirà informazioni sul webhook attivo, come l'URL e lo stato. ✅