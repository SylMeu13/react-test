import { useState, type FormEvent } from "react";
import Token from "../utils/token";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import APIError from "../utils/apiError";

export default function LoginPage() {
  return (
    <div className="box">
      <h2>Connexion</h2>
      <LoginForm />
    </div>
  );
}

export function LoginForm() {
  const [isLogging, setIsLogging] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setIsLogging(true);
    Token.setToken(token);

    try {
      await API.loadPromotions();
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      Token.clearToken();
      setIsLogging(false);

      let message;
      if (error instanceof APIError) {
        switch (error.statusCode) {
          case 401:
            message = "Vos identifiants sont invalides !";
            break;
          default:
            message = error.message;
            break;
        }
      } else {
        message = "Une erreur inconnue a eu lieu !";
      }
      setError(message);
    }
  }

  return (
    <form>
      <fieldset>
        <label htmlFor="token">Token :</label>
        <input
          type="password"
          name="token"
          id="token"
          onInput={(e) => setToken(e.currentTarget.value)}
          value={token}
          disabled={isLogging}
        />
        {error != "" && <p className="error">{error}</p>}
      </fieldset>
      {isLogging ? (
        <button disabled>Connexion...</button>
      ) : (
        <button onClick={handleLogin}>Se connecter</button>
      )}
    </form>
  );
}
