// Test data utilities for SOUVIENS_TOI application
import { supabase } from '../lib/supabase';

export interface TestUser {
  email: string;
  password: string;
  displayName: string;
}

export interface TestEvent {
  title: string;
  date: string;
  description: string;
  location?: string;
  precise_date: boolean;
}

export interface TestStory {
  title: string;
  content: string;
}

// Test user credentials
export const TEST_USER: TestUser = {
  email: 'test@souviens-toi.fr',
  password: 'TestPassword123!',
  displayName: 'Utilisateur Test'
};

// Sample events for testing
export const SAMPLE_EVENTS: TestEvent[] = [
  {
    title: 'Naissance de Grand-père Pierre',
    date: '1920-03-15',
    description: 'Naissance de Pierre Dupont à Lyon, France. Premier enfant de la famille.',
    location: 'Lyon, France',
    precise_date: true
  },
  {
    title: 'Mariage de Pierre et Marie',
    date: '1945-06-20',
    description: 'Mariage de Pierre Dupont et Marie Martin à l\'église Saint-Jean de Lyon.',
    location: 'Église Saint-Jean, Lyon',
    precise_date: true
  },
  {
    title: 'Naissance de Papa Jean',
    date: '1950-12-10',
    description: 'Naissance de Jean Dupont, fils de Pierre et Marie.',
    location: 'Hôpital de Lyon',
    precise_date: true
  },
  {
    title: 'Déménagement à Paris',
    date: '1960-01-01',
    description: 'La famille Dupont déménage à Paris pour le travail de Pierre.',
    location: 'Paris, France',
    precise_date: false
  },
  {
    title: 'Mariage de Jean et Sophie',
    date: '1975-08-15',
    description: 'Mariage de Jean Dupont et Sophie Moreau à la mairie du 15ème arrondissement.',
    location: 'Mairie du 15ème, Paris',
    precise_date: true
  },
  {
    title: 'Ma naissance',
    date: '1980-04-22',
    description: 'Ma naissance à l\'hôpital Saint-Antoine à Paris.',
    location: 'Hôpital Saint-Antoine, Paris',
    precise_date: true
  }
];

// Sample stories for testing
export const SAMPLE_STORIES: TestStory[] = [
  {
    title: 'Les recettes de Grand-mère Marie',
    content: `Grand-mère Marie était réputée dans tout le quartier pour ses délicieuses tartes aux pommes. Elle avait un secret qu'elle ne révélait qu'aux femmes de la famille : elle ajoutait toujours une pincée de cannelle et un soupçon de rhum dans sa pâte.

Chaque dimanche, toute la famille se réunissait autour de sa grande table en chêne pour déguster ses créations. L'odeur de ses gâteaux embaumait toute la maison et attirait même les voisins qui trouvaient toujours une excuse pour passer "juste dire bonjour".

Cette tradition s'est perpétuée pendant des décennies, et aujourd'hui encore, quand je sens l'odeur de la cannelle, je repense à ces moments magiques passés dans sa cuisine.`
  },
  {
    title: 'L\'histoire du médaillon familial',
    content: `Le médaillon en or que porte notre famille depuis des générations a une histoire fascinante. Il appartenait à mon arrière-arrière-grand-mère, Célestine, qui l'avait reçu de sa propre mère avant de partir pour l'Amérique en 1890.

Célestine n'a finalement jamais fait le voyage, ayant rencontré l'amour de sa vie, mon arrière-arrière-grand-père Auguste, juste avant son départ. Le médaillon est resté dans la famille et a été transmis de mère en fille depuis.

À l'intérieur, on peut encore voir la petite photo de Célestine, âgée de 20 ans, avec ses longs cheveux bruns et son sourire malicieux. Ce médaillon représente pour nous le lien indéfectible entre les générations et l'importance de préserver notre histoire familiale.`
  },
  {
    title: 'Les étés à la campagne',
    content: `Chaque été de mon enfance, nous partions chez l'oncle Marcel dans sa ferme en Normandie. C'était un monde complètement différent de notre vie parisienne : les réveils au chant du coq, la traite des vaches, la cueillette des pommes dans le verger.

Mon cousin Paul et moi passions nos journées à explorer les champs, à construire des cabanes dans les arbres et à pêcher dans la petite rivière qui traversait la propriété. Le soir, toute la famille se réunissait sur la terrasse pour écouter les histoires d'oncle Marcel sur "le bon vieux temps".

Ces étés ont forgé ma personnalité et m'ont appris l'importance de la nature et de la simplicité. Aujourd'hui, quand je sens l'odeur du foin coupé, je suis immédiatement transporté dans ces souvenirs d'enfance inoubliables.`
  }
];

// Authentication test functions
export const createTestUser = async (): Promise<{ success: boolean; message: string; user?: any }> => {
  try {
    console.log('🔄 Creating test user...');
    
    // Try to sign up the test user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: TEST_USER.email,
      password: TEST_USER.password,
      options: {
        data: {
          full_name: TEST_USER.displayName
        }
      }
    });

    if (signUpError) {
      // If user already exists, try to sign in
      if (signUpError.message === 'User already registered') {
        console.log('👤 User already exists, attempting sign in...');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: TEST_USER.email,
          password: TEST_USER.password,
        });
        
        if (signInError) {
          return {
            success: false,
            message: `Erreur de connexion: ${signInError.message}`
          };
        }
        
        return {
          success: true,
          message: 'Utilisateur test connecté avec succès (existait déjà)',
          user: signInData.user
        };
      }
      
      return {
        success: false,
        message: `Erreur lors de la création: ${signUpError.message}`
      };
    }

    return {
      success: true,
      message: 'Utilisateur test créé avec succès',
      user: signUpData.user
    };
  } catch (error) {
    console.error('Error creating test user:', error);
    return {
      success: false,
      message: `Erreur inattendue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    };
  }
};

export const signInTestUser = async (): Promise<{ success: boolean; message: string; user?: any }> => {
  try {
    console.log('🔄 Signing in test user...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
    
    if (error) {
      return {
        success: false,
        message: `Erreur de connexion: ${error.message}`
      };
    }
    
    return {
      success: true,
      message: 'Connexion réussie',
      user: data.user
    };
  } catch (error) {
    console.error('Error signing in test user:', error);
    return {
      success: false,
      message: `Erreur inattendue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    };
  }
};

export const createSampleEvents = async (): Promise<{ success: boolean; message: string; count?: number }> => {
  try {
    console.log('🔄 Creating sample events...');
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return {
        success: false,
        message: 'Utilisateur non connecté'
      };
    }

    // Insert sample events
    const eventsToInsert = SAMPLE_EVENTS.map(event => ({
      ...event,
      created_by: user.id
    }));

    const { data, error } = await supabase
      .from('events')
      .insert(eventsToInsert)
      .select();

    if (error) {
      return {
        success: false,
        message: `Erreur lors de la création des événements: ${error.message}`
      };
    }

    return {
      success: true,
      message: `${data?.length || 0} événements créés avec succès`,
      count: data?.length || 0
    };
  } catch (error) {
    console.error('Error creating sample events:', error);
    return {
      success: false,
      message: `Erreur inattendue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    };
  }
};

export const createSampleStories = async (): Promise<{ success: boolean; message: string; count?: number }> => {
  try {
    console.log('🔄 Creating sample stories...');
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return {
        success: false,
        message: 'Utilisateur non connecté'
      };
    }

    // Insert sample stories
    const storiesToInsert = SAMPLE_STORIES.map(story => ({
      ...story,
      created_by: user.id
    }));

    const { data, error } = await supabase
      .from('stories')
      .insert(storiesToInsert)
      .select();

    if (error) {
      return {
        success: false,
        message: `Erreur lors de la création des récits: ${error.message}`
      };
    }

    return {
      success: true,
      message: `${data?.length || 0} récits créés avec succès`,
      count: data?.length || 0
    };
  } catch (error) {
    console.error('Error creating sample stories:', error);
    return {
      success: false,
      message: `Erreur inattendue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    };
  }
};

export const runFullTest = async (): Promise<{ success: boolean; message: string; details: string[] }> => {
  const details: string[] = [];
  
  try {
    // Step 1: Create/Sign in test user
    const userResult = await createTestUser();
    details.push(`👤 Utilisateur: ${userResult.message}`);
    
    if (!userResult.success) {
      return {
        success: false,
        message: 'Échec lors de la création/connexion de l\'utilisateur test',
        details
      };
    }

    // Step 2: Create sample events
    const eventsResult = await createSampleEvents();
    details.push(`📅 Événements: ${eventsResult.message}`);

    // Step 3: Create sample stories
    const storiesResult = await createSampleStories();
    details.push(`📖 Récits: ${storiesResult.message}`);

    const allSuccess = userResult.success && eventsResult.success && storiesResult.success;
    
    return {
      success: allSuccess,
      message: allSuccess ? 'Test complet réussi!' : 'Test partiellement réussi',
      details
    };
  } catch (error) {
    console.error('Error running full test:', error);
    return {
      success: false,
      message: `Erreur lors du test: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      details
    };
  }
};

export const cleanupTestData = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('🧹 Cleaning up test data...');
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return {
        success: false,
        message: 'Utilisateur non connecté'
      };
    }

    // Delete events created by test user
    const { error: eventsError } = await supabase
      .from('events')
      .delete()
      .eq('created_by', user.id);

    // Delete stories created by test user
    const { error: storiesError } = await supabase
      .from('stories')
      .delete()
      .eq('created_by', user.id);

    if (eventsError || storiesError) {
      return {
        success: false,
        message: `Erreur lors du nettoyage: ${eventsError?.message || storiesError?.message}`
      };
    }

    return {
      success: true,
      message: 'Données de test supprimées avec succès'
    };
  } catch (error) {
    console.error('Error cleaning up test data:', error);
    return {
      success: false,
      message: `Erreur inattendue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    };
  }
};
export const checkEmailExists = async (email: string): Promise<{ success: boolean; message: string; details: any }> => {
  try {
    console.log('🔍 Checking if email exists:', email);
    
    // Method 1: Try to sign up with the email to see Supabase's response
    console.log('Method 1: Testing signup response...');
    const { data: signUpTest, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: 'temporary-test-password-123',
      options: {
        data: { full_name: 'Test User' }
      }
    });
    
    // Method 2: Check in auth.users table (this will show if user exists in Supabase Auth)
    console.log('Method 2: Checking auth.users table...');
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    let authUserExists = false;
    let authUserDetails = null;
    
    if (!authError && authData?.users) {
      const foundUser = authData.users.find(user => user.email === email);
      if (foundUser) {
        authUserExists = true;
        authUserDetails = {
          id: foundUser.id,
          email: foundUser.email,
          created_at: foundUser.created_at,
          email_confirmed_at: foundUser.email_confirmed_at,
          last_sign_in_at: foundUser.last_sign_in_at
        };
      }
    }
    
    // Method 3: Check in profiles table
    console.log('Method 3: Checking profiles table...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(100); // Get all profiles to check
    
    let profileExists = false;
    let profileDetails = null;
    
    if (!profileError && profileData) {
      // We can't directly query by email in profiles, so we check all profiles
      // and match with auth user data
      if (authUserDetails) {
        const foundProfile = profileData.find(profile => profile.id === authUserDetails.id);
        if (foundProfile) {
          profileExists = true;
          profileDetails = foundProfile;
        }
      }
    }
    
    // Method 4: Try to get user by email using auth admin (if available)
    console.log('Method 4: Trying auth admin getUserByEmail...');
    let adminUserCheck = null;
    let adminError = null;
    try {
      // This might not work depending on permissions, but let's try
      const { data: adminData, error: adminErr } = await supabase.auth.admin.getUserByEmail(email);
      adminUserCheck = adminData;
      adminError = adminErr;
    } catch (err) {
      adminError = err;
    }
    
    const details = {
      email,
      // Method 1 results
      signUpTestError: signUpError?.message,
      signUpTestCode: signUpError?.code || signUpError?.status,
      signUpTestUser: signUpTest?.user ? {
        id: signUpTest.user.id,
        email: signUpTest.user.email,
        created_at: signUpTest.user.created_at
      } : null,
      // Method 2 results
      authUserExists,
      authUserDetails,
      // Method 3 results
      profileExists,
      profileDetails,
      // Method 4 results
      adminUserCheck: adminUserCheck?.user ? {
        id: adminUserCheck.user.id,
        email: adminUserCheck.user.email,
        created_at: adminUserCheck.user.created_at
      } : null,
      adminError: adminError?.message,
      // Errors
      authError: authError?.message,
      profileError: profileError?.message,
      totalProfiles: profileData?.length || 0
    };
    
    let message = `Email ${email}:\n`;
    message += `- SignUp Test Response: ${signUpError ? `ERROR: ${signUpError.message} (${signUpError.code})` : 'SUCCESS (user created or already exists)'}\n`;
    message += `- Existe dans auth.users: ${authUserExists ? 'OUI' : 'NON'}\n`;
    message += `- Existe dans profiles: ${profileExists ? 'OUI' : 'NON'}\n`;
    message += `- Admin check: ${adminUserCheck ? 'FOUND' : 'NOT FOUND'}\n`;
    message += `- Total profils dans la DB: ${details.totalProfiles}`;
    
    if (authError) {
      message += `\n- Erreur auth: ${authError.message}`;
    }
    
    if (adminError) {
      message += `\n- Erreur admin: ${adminError.message}`;
    }
    
    // If signup failed with user_already_exists, but we can't find the user, that's the issue
    if (signUpError?.message === 'User already registered' && !authUserExists && !adminUserCheck) {
      message += `\n\n⚠️  PROBLÈME IDENTIFIÉ: Supabase Auth dit que l'utilisateur existe, mais il n'est visible nulle part!`;
      message += `\n   Cela peut être dû à:`;
      message += `\n   1. Un utilisateur supprimé de façon incomplète`;
      message += `\n   2. Un problème de cache Supabase`;
      message += `\n   3. Des permissions insuffisantes pour voir l'utilisateur`;
    }
    
    return {
      success: true,
      message,
      details
    };
  } catch (error) {
    console.error('Error checking email:', error);
    return {
      success: false,
      message: `Erreur lors de la vérification: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      details: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
    };
  }
};

export const listAllUsers = async (): Promise<{ success: boolean; message: string; details: any }> => {
  try {
    console.log('📋 Listing all users...');
    
    // Get all auth users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    // Get all profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*');
    
    const details = {
      authUsers: authData?.users || [],
      profiles: profileData || [],
      authError: authError?.message,
      profileError: profileError?.message,
      authUserCount: authData?.users?.length || 0,
      profileCount: profileData?.length || 0
    };
    
    let message = `Utilisateurs dans la base de données:\n`;
    message += `- Auth users: ${details.authUserCount}\n`;
    message += `- Profiles: ${details.profileCount}\n`;
    
    if (details.authUsers.length > 0) {
      message += `\nAuth users:\n`;
      details.authUsers.forEach((user: any, index: number) => {
        message += `  ${index + 1}. ${user.email} (ID: ${user.id.substring(0, 8)}...)\n`;
      });
    }
    
    if (details.profiles.length > 0) {
      message += `\nProfiles:\n`;
      details.profiles.forEach((profile: any, index: number) => {
        message += `  ${index + 1}. ${profile.full_name || 'Sans nom'} (ID: ${profile.id.substring(0, 8)}...)\n`;
      });
    }
    
    if (authError) {
      message += `\nErreur auth: ${authError.message}`;
    }
    
    if (profileError) {
      message += `\nErreur profiles: ${profileError.message}`;
    }
    
    return {
      success: true,
      message,
      details
    };
  } catch (error) {
    console.error('Error listing users:', error);
    return {
      success: false,
      message: `Erreur lors de la récupération des utilisateurs: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      details: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
    };
  }
};