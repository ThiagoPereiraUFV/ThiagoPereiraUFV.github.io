import { userData } from '../userdata';

describe('userData helper', () => {
  describe('userData object structure', () => {
    it('should contain username property', () => {
      expect(userData).toHaveProperty('username');
      expect(typeof userData.username).toBe('string');
    });

    it('should contain profileName property', () => {
      expect(userData).toHaveProperty('profileName');
      expect(typeof userData.profileName).toBe('string');
    });

    it('should contain contact property', () => {
      expect(userData).toHaveProperty('contact');
      expect(typeof userData.contact).toBe('object');
    });

    it('should have correct username value', () => {
      expect(userData.username).toBe('ThiagoPereiraUFV');
    });

    it('should have correct profileName value', () => {
      expect(userData.profileName).toBe('Thiago Pereira');
    });
  });

  describe('contact information structure', () => {
    it('should contain email contact info', () => {
      expect(userData.contact).toHaveProperty('email');
      expect(userData.contact.email).toHaveProperty('url');
      expect(userData.contact.email).toHaveProperty('icon');
      expect(userData.contact.email).toHaveProperty('iconDark');
    });

    it('should contain linkedin contact info', () => {
      expect(userData.contact).toHaveProperty('linkedin');
      expect(userData.contact.linkedin).toHaveProperty('url');
      expect(userData.contact.linkedin).toHaveProperty('icon');
      expect(userData.contact.linkedin).toHaveProperty('iconDark');
    });

    it('should contain github contact info', () => {
      expect(userData.contact).toHaveProperty('github');
      expect(userData.contact.github).toHaveProperty('url');
      expect(userData.contact.github).toHaveProperty('icon');
      expect(userData.contact.github).toHaveProperty('iconDark');
    });
  });

  describe('contact URLs validation', () => {
    it('should have valid email URL format', () => {
      expect(userData.contact.email.url).toMatch(/^mailto:/);
      expect(userData.contact.email.url).toBe('mailto:thiago.marinho.pereira.98@gmail.com');
    });

    it('should have valid LinkedIn URL format', () => {
      expect(userData.contact.linkedin.url).toMatch(/^https:\/\/www\.linkedin\.com/);
      expect(userData.contact.linkedin.url).toBe('https://www.linkedin.com/in/thiagopereira98');
    });

    it('should have valid GitHub URL format', () => {
      expect(userData.contact.github.url).toMatch(/^https:\/\/github\.com/);
      expect(userData.contact.github.url).toBe('https://github.com/ThiagoPereiraUFV');
    });
  });

  describe('icon properties validation', () => {
    it('should have icon objects for all contact methods', () => {
      expect(userData.contact.email.icon).toBeDefined();
      expect(userData.contact.email.iconDark).toBeDefined();
      expect(userData.contact.linkedin.icon).toBeDefined();
      expect(userData.contact.linkedin.iconDark).toBeDefined();
      expect(userData.contact.github.icon).toBeDefined();
      expect(userData.contact.github.iconDark).toBeDefined();
    });

    it('should have icons with appropriate structure', () => {
      // Icons are imported SVG files that get processed by Next.js
      // They should be defined and not null/undefined
      expect(userData.contact.email.icon).toBeDefined();
      expect(userData.contact.email.iconDark).toBeDefined();
      expect(userData.contact.linkedin.icon).toBeDefined();  
      expect(userData.contact.linkedin.iconDark).toBeDefined();
      expect(userData.contact.github.icon).toBeDefined();
      expect(userData.contact.github.iconDark).toBeDefined();
    });
  });

  describe('type consistency and structure', () => {
    it('should be a read-only object (due to const assertion)', () => {
      // The object is marked as 'as const' making it read-only at compile time
      // We can test that properties exist and have correct types
      expect(typeof userData.username).toBe('string');
      expect(typeof userData.profileName).toBe('string');
      expect(typeof userData.contact).toBe('object');
    });

    it('should maintain deep object structure integrity', () => {
      // Test that contact objects have required properties
      const contactMethods = ['email', 'linkedin', 'github'];
      contactMethods.forEach(method => {
        expect(userData.contact).toHaveProperty(method);
        expect(userData.contact[method as keyof typeof userData.contact]).toHaveProperty('url');
        expect(userData.contact[method as keyof typeof userData.contact]).toHaveProperty('icon');
        expect(userData.contact[method as keyof typeof userData.contact]).toHaveProperty('iconDark');
      });
    });

    it('should maintain consistent typing', () => {
      // Test that the userData object matches the expected structure
      const expectedKeys = ['username', 'profileName', 'contact'];
      const actualKeys = Object.keys(userData);
      
      expectedKeys.forEach(key => {
        expect(actualKeys).toContain(key);
      });

      const expectedContactKeys = ['email', 'linkedin', 'github'];
      const actualContactKeys = Object.keys(userData.contact);
      
      expectedContactKeys.forEach(key => {
        expect(actualContactKeys).toContain(key);
      });
    });
  });
});