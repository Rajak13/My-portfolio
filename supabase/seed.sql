-- Insert default translations for English
INSERT INTO translations (key, language, value) VALUES
    ('nav.home', 'en', 'Home'),
    ('nav.projects', 'en', 'Projects'),
    ('nav.blog', 'en', 'Blog'),
    ('nav.about', 'en', 'About'),
    ('nav.dashboard', 'en', 'Dashboard'),
    ('hero.title', 'en', 'Creative Developer & Designer'),
    ('hero.subtitle', 'en', 'Building digital experiences with modern technologies'),
    ('projects.title', 'en', 'Featured Projects'),
    ('projects.view_all', 'en', 'View All Projects'),
    ('blog.title', 'en', 'Latest Posts'),
    ('blog.view_all', 'en', 'View All Posts'),
    ('footer.copyright', 'en', '© 2024 Portfolio. All rights reserved.'),
    ('dashboard.welcome', 'en', 'Welcome to your dashboard'),
    ('dashboard.projects', 'en', 'Manage Projects'),
    ('dashboard.posts', 'en', 'Manage Posts'),
    ('dashboard.media', 'en', 'Media Library'),
    ('dashboard.themes', 'en', 'Themes'),
    ('dashboard.settings', 'en', 'Settings'),
    ('auth.login', 'en', 'Login'),
    ('auth.logout', 'en', 'Logout'),
    ('auth.email', 'en', 'Email'),
    ('auth.password', 'en', 'Password'),
    ('common.save', 'en', 'Save'),
    ('common.cancel', 'en', 'Cancel'),
    ('common.delete', 'en', 'Delete'),
    ('common.edit', 'en', 'Edit'),
    ('common.create', 'en', 'Create'),
    ('common.publish', 'en', 'Publish'),
    ('common.draft', 'en', 'Draft'),
    ('common.loading', 'en', 'Loading...');

-- Insert default translations for Nepali
INSERT INTO translations (key, language, value) VALUES
    ('nav.home', 'ne', 'गृह'),
    ('nav.projects', 'ne', 'परियोजनाहरू'),
    ('nav.blog', 'ne', 'ब्लग'),
    ('nav.about', 'ne', 'बारेमा'),
    ('nav.dashboard', 'ne', 'ड्यासबोर्ड'),
    ('hero.title', 'ne', 'रचनात्मक विकासकर्ता र डिजाइनर'),
    ('hero.subtitle', 'ne', 'आधुनिक प्रविधिहरूसँग डिजिटल अनुभवहरू निर्माण गर्दै'),
    ('projects.title', 'ne', 'विशेष परियोजनाहरू'),
    ('projects.view_all', 'ne', 'सबै परियोजनाहरू हेर्नुहोस्'),
    ('blog.title', 'ne', 'नवीनतम पोस्टहरू'),
    ('blog.view_all', 'ne', 'सबै पोस्टहरू हेर्नुहोस्'),
    ('footer.copyright', 'ne', '© २०२४ पोर्टफोलियो। सबै अधिकार सुरक्षित।'),
    ('dashboard.welcome', 'ne', 'तपाईंको ड्यासबोर्डमा स्वागत छ'),
    ('dashboard.projects', 'ne', 'परियोजनाहरू व्यवस्थापन'),
    ('dashboard.posts', 'ne', 'पोस्टहरू व्यवस्थापन'),
    ('dashboard.media', 'ne', 'मिडिया पुस्तकालय'),
    ('dashboard.themes', 'ne', 'थिमहरू'),
    ('dashboard.settings', 'ne', 'सेटिङहरू'),
    ('auth.login', 'ne', 'लगइन'),
    ('auth.logout', 'ne', 'लगआउट'),
    ('auth.email', 'ne', 'इमेल'),
    ('auth.password', 'ne', 'पासवर्ड'),
    ('common.save', 'ne', 'सेभ गर्नुहोस्'),
    ('common.cancel', 'ne', 'रद्द गर्नुहोस्'),
    ('common.delete', 'ne', 'मेटाउनुहोस्'),
    ('common.edit', 'ne', 'सम्पादन गर्नुहोस्'),
    ('common.create', 'ne', 'सिर्जना गर्नुहोस्'),
    ('common.publish', 'ne', 'प्रकाशित गर्नुहोस्'),
    ('common.draft', 'ne', 'मस्यौदा'),
    ('common.loading', 'ne', 'लोड हुँदै...');

-- Insert a default theme
INSERT INTO themes (slug, name, data, is_public, created_by) VALUES
    ('default', 'Default Theme', '{
        "colors": {
            "primary": "#3b82f6",
            "secondary": "#64748b",
            "accent": "#f59e0b",
            "background": "#ffffff",
            "surface": "#f8fafc",
            "text": "#1e293b"
        },
        "fonts": {
            "heading": "Inter",
            "body": "Inter",
            "mono": "JetBrains Mono"
        },
        "spacing": {
            "scale": 1,
            "rhythm": 1.5
        }
    }', true, (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1));

-- Insert a dark theme
INSERT INTO themes (slug, name, data, is_public, created_by) VALUES
    ('dark', 'Dark Theme', '{
        "colors": {
            "primary": "#60a5fa",
            "secondary": "#94a3b8",
            "accent": "#fbbf24",
            "background": "#0f172a",
            "surface": "#1e293b",
            "text": "#f1f5f9"
        },
        "fonts": {
            "heading": "Inter",
            "body": "Inter",
            "mono": "JetBrains Mono"
        },
        "spacing": {
            "scale": 1,
            "rhythm": 1.5
        }
    }', true, (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1));