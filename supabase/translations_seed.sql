-- Basic translations for testing the i18n system
-- This file can be run to populate the translations table with initial data

INSERT INTO translations (key, language, value) VALUES
-- Navigation
('nav.home', 'en', 'Home'),
('nav.home', 'ne', 'गृह'),
('nav.projects', 'en', 'Projects'),
('nav.projects', 'ne', 'परियोजनाहरू'),
('nav.blog', 'en', 'Blog'),
('nav.blog', 'ne', 'ब्लग'),
('nav.about', 'en', 'About'),
('nav.about', 'ne', 'बारेमा'),
('nav.contact', 'en', 'Contact'),
('nav.contact', 'ne', 'सम्पर्क'),

-- Common UI elements
('common.loading', 'en', 'Loading...'),
('common.loading', 'ne', 'लोड हुँदै...'),
('common.save', 'en', 'Save'),
('common.save', 'ne', 'सुरक्षित गर्नुहोस्'),
('common.cancel', 'en', 'Cancel'),
('common.cancel', 'ne', 'रद्द गर्नुहोस्'),
('common.edit', 'en', 'Edit'),
('common.edit', 'ne', 'सम्पादन गर्नुहोस्'),
('common.delete', 'en', 'Delete'),
('common.delete', 'ne', 'मेटाउनुहोस्'),
('common.search', 'en', 'Search'),
('common.search', 'ne', 'खोज्नुहोस्'),

-- Hero section
('hero.title', 'en', 'Welcome to My Portfolio'),
('hero.title', 'ne', 'मेरो पोर्टफोलियोमा स्वागत छ'),
('hero.subtitle', 'en', 'Crafting digital experiences with passion and precision'),
('hero.subtitle', 'ne', 'जुनून र परिशुद्धताका साथ डिजिटल अनुभवहरू सिर्जना गर्दै'),

-- Authentication
('auth.login', 'en', 'Login'),
('auth.login', 'ne', 'लगइन'),
('auth.logout', 'en', 'Logout'),
('auth.logout', 'ne', 'लगआउट'),
('auth.signup', 'en', 'Sign Up'),
('auth.signup', 'ne', 'साइन अप'),
('auth.email', 'en', 'Email'),
('auth.email', 'ne', 'इमेल'),
('auth.password', 'en', 'Password'),
('auth.password', 'ne', 'पासवर्ड'),

-- Dashboard
('dashboard.title', 'en', 'Dashboard'),
('dashboard.title', 'ne', 'ड्यासबोर्ड'),
('dashboard.projects', 'en', 'Manage Projects'),
('dashboard.projects', 'ne', 'परियोजनाहरू व्यवस्थापन'),
('dashboard.posts', 'en', 'Manage Posts'),
('dashboard.posts', 'ne', 'पोस्टहरू व्यवस्थापन'),
('dashboard.themes', 'en', 'Manage Themes'),
('dashboard.themes', 'ne', 'थिमहरू व्यवस्थापन'),
('dashboard.translations', 'en', 'Manage Translations'),
('dashboard.translations', 'ne', 'अनुवादहरू व्यवस्थापन'),

-- Projects
('projects.title', 'en', 'My Projects'),
('projects.title', 'ne', 'मेरा परियोजनाहरू'),
('projects.view_project', 'en', 'View Project'),
('projects.view_project', 'ne', 'परियोजना हेर्नुहोस्'),
('projects.github', 'en', 'View on GitHub'),
('projects.github', 'ne', 'GitHub मा हेर्नुहोस्'),
('projects.demo', 'en', 'Live Demo'),
('projects.demo', 'ne', 'प्रत्यक्ष डेमो'),

-- Blog
('blog.title', 'en', 'Blog Posts'),
('blog.title', 'ne', 'ब्लग पोस्टहरू'),
('blog.read_more', 'en', 'Read More'),
('blog.read_more', 'ne', 'थप पढ्नुहोस्'),
('blog.published_on', 'en', 'Published on'),
('blog.published_on', 'ne', 'प्रकाशित मिति'),

-- Language switcher
('language.switch_to_english', 'en', 'Switch to English'),
('language.switch_to_english', 'ne', 'अंग्रेजीमा स्विच गर्नुहोस्'),
('language.switch_to_nepali', 'en', 'Switch to Nepali'),
('language.switch_to_nepali', 'ne', 'नेपालीमा स्विच गर्नुहोस्'),

-- Error messages
('error.generic', 'en', 'Something went wrong. Please try again.'),
('error.generic', 'ne', 'केहि गलत भयो। कृपया फेरि प्रयास गर्नुहोस्।'),
('error.network', 'en', 'Network error. Please check your connection.'),
('error.network', 'ne', 'नेटवर्क त्रुटि। कृपया आफ्नो जडान जाँच गर्नुहोस्।'),
('error.unauthorized', 'en', 'You are not authorized to perform this action.'),
('error.unauthorized', 'ne', 'तपाईं यो कार्य गर्न अधिकृत हुनुहुन्न।')

ON CONFLICT (key, language) DO UPDATE SET
  value = EXCLUDED.value;