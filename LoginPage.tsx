import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { LogIn, Eye, EyeOff, RefreshCw } from 'lucide-react';

const LoginPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const emailFromUrl = searchParams.get('email') || '';
  const isConfirmed = searchParams.get('confirmed') === 'true';
  
  const [email, setEmail] = useState(emailFromUrl);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  
  const { login, resendConfirmationEmail } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isConfirmed) {
      showToast('Email confirmé avec succès! Vous pouvez maintenant vous connecter.', 'success');
    }
  }, [isConfirmed, showToast]);
  
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;
    
    if (!email) {
      newErrors.email = 'L\'email est requis';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'L\'email est invalide';
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleResendConfirmation = async () => {
    setResendingEmail(true);
    try {
      await resendConfirmationEmail(email);
      showToast('Email de confirmation renvoyé. Veuillez vérifier votre boîte de réception.', 'success');
    } catch (error) {
      showToast('Erreur lors de l\'envoi de l\'email de confirmation. Veuillez réessayer.', 'error');
    } finally {
      setResendingEmail(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      console.log('Attempting login with email:', email);
      console.log('Password length:', password.length);
      
      await login(email, password);
      showToast('Connexion réussie!', 'success');
      navigate('/timeline');
    } catch (error: any) {
      console.error('Error logging in:', error);
      
      if (error.message?.includes('Invalid login credentials') || 
          error.message?.includes('invalid_credentials') ||
          error.code === 'invalid_credentials') {
        setErrors({
          general: 'Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.'
        });
      } else if (error.message?.includes('Email not confirmed') || 
                 error.message?.includes('email_not_confirmed')) {
        setErrors({
          general: 'Votre email n\'a pas été confirmé. Utilisez le bouton ci-dessous pour renvoyer l\'email de confirmation.'
        });
      } else if (error.message?.includes('signup_disabled')) {
        setErrors({
          general: 'Les inscriptions sont désactivées. Contactez l\'administrateur.'
        });
      } else {
        setErrors({
          general: `Erreur de connexion: ${error.message || 'Erreur inconnue'}`
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-primary-50 bg-paper-texture">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold font-serif tracking-tight text-primary-800">
          Connexion à ton compte
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Ou{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            crée un nouveau compte
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-vintage sm:rounded-lg sm:px-10 border border-primary-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{errors.general}</p>
                {email && (
                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleResendConfirmation}
                      isLoading={resendingEmail}
                      icon={<RefreshCw size={18} />}
                      className="w-full"
                    >
                      Renvoyer l'e-mail de confirmation
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div>
              <Input
                id="email"
                name="email"
                type="email"
                label="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                error={errors.email}
                required
              />
            </div>

            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                error={errors.password}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-9 text-neutral-500 hover:text-neutral-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/reset-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Mot de passe oublié?
              </Link>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loading}
                icon={<LogIn size={18} />}
              >
                Se connecter
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;