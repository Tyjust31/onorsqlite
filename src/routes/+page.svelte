<script lang="ts">
  let pseudo = $state('');
  let password = $state('');
  let message = $state('');

  async function handleLogin() {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo, password })
    });
    const data = await res.json();
    
    if (data.success) {
      window.location.href = '/protected';
    } else {
      message = data.message;
    }
  }

  async function handleRegister() {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo, password })
    });
    const data = await res.json();
    message = data.message;
  }
</script>
<div class="hero">
  <div class="header">
    <div class="logo">Ω</div>
    <div class="title">Onor Calcul</div>
    <div class="subtitle">Logiciel de Gestion de Calculs Avancés</div>
  </div>

  <div class="form-container">
    <h2 class="form-title">Connexion à votre espace</h2>
    
    <div class="input-group">
      <input 
        type="text" 
        bind:value={pseudo} 
        placeholder="Nom d'utilisateur" 
        autocomplete="username"
      />
    </div>

    <div class="input-group">
      <input 
        type="password" 
        bind:value={password} 
        placeholder="Mot de passe" 
        autocomplete="current-password"
      />
    </div>

    <div class="button-group">
      <button class="primary" onclick={handleLogin}>
        Se connecter
      </button>
      <button class="secondary" onclick={handleRegister}>
        Créer un compte
      </button>
    </div>

    {#if message}
      <div class="message">{message}</div>
    {/if}
  </div>

  <div class="footer">
    <div class="copyright">© 2025 Onor Calcul - Tous droits réservés</div>
    <div class="version">Version 1.0.0</div>
  </div>
</div>
<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .hero {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #476be3 100%);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
      animation: float 20s ease-in-out infinite;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
      z-index: 1;

      .logo {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #5b89d8, #4ecdc4);
        border-radius: 20px;
        margin: 0 auto 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
        color: white;
       // box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: pulse 2s infinite;
      }

      .title {
        font-size: 2.8rem;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 0.5rem;
        letter-spacing: -0.02em;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      }

      .subtitle {
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 400;
        letter-spacing: 0.02em;
      }
    }

    .form-container {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      padding: 3rem 2.5rem;
      border-radius: 24px;
      box-shadow: 
        0 25px 50px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.2);
      width: 100%;
      max-width: 420px;
      z-index: 1;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 
          0 35px 70px rgba(0, 0, 0, 0.2),
          0 0 0 1px rgba(255, 255, 255, 0.3);
      }

      .form-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #2d3748;
        text-align: center;
        margin-bottom: 2rem;
      }

      .input-group {
        position: relative;
        margin-bottom: 1.5rem;

        input {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 400;
          color: #2d3748;
          background: #ffffff;
          transition: all 0.3s ease;
          outline: none;

          &::placeholder {
            color: #a0aec0;
            font-weight: 400;
          }

          &:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            transform: translateY(-1px);
          }

          &:hover:not(:focus) {
            border-color: #cbd5e0;
          }
        }
      }

      .button-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 2rem;

        button {
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }

          &:hover::before {
            left: 100%;
          }

          &.primary {
            background: linear-gradient(135deg, #667eea 0%, #4b6ea2 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
            }

            &:active {
              transform: translateY(0);
            }
          }

          &.secondary {
            background: #ffffff;
            color: #667eea;
            border: 2px solid #667eea;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);

            &:hover {
              background: #667eea;
              color: white;
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            }
          }
        }
      }

      .message {
        margin-top: 1.5rem;
        padding: 1rem;
        border-radius: 12px;
        font-size: 0.95rem;
        font-weight: 500;
        text-align: center;
        background: linear-gradient(135deg, #fed7e2, #fbb6ce);
        color: #97266d;
        border: 1px solid #f687b3;
        animation: slideIn 0.3s ease;
      }
    }

    .footer {
      position: absolute;
      bottom: 2rem;
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
      z-index: 1;

      .copyright {
        margin-bottom: 0.5rem;
      }

      .version {
        font-size: 0.8rem;
        opacity: 0.8;
      }
    }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(1deg); }
    66% { transform: translateY(5px) rotate(-1deg); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .hero {
      padding: 1.5rem;

      .header {
        margin-bottom: 2rem;

        .title {
          font-size: 2.2rem;
        }

        .subtitle {
          font-size: 1rem;
        }
      }

      .form-container {
        padding: 2rem 1.5rem;
        margin: 0 1rem;
      }
    }
  }

  @media (max-width: 480px) {
    .hero {
      .header {
        .title {
          font-size: 1.8rem;
        }
      }

      .form-container {
        padding: 1.5rem 1rem;
      }
    }
  }
</style>

