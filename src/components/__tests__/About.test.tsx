import { render, screen } from '@testing-library/react';
import About from '../organisms/About';
import { IAboutProps } from '@/interfaces/about';

describe('About Component', () => {
  it('should render about section with HTML content', () => {
    const props: IAboutProps = {
      aboutUserData: '<h2>About Me</h2><p>I am a developer</p>'
    };

    const { container } = render(<About {...props} />);
    
    const section = container.querySelector('#about');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'about');
    expect(section?.tagName.toLowerCase()).toBe('section');
  });

  it('should render HTML content using dangerouslySetInnerHTML', () => {
    const props: IAboutProps = {
      aboutUserData: '<h2>John Doe</h2><p>Full Stack Developer with 5 years of experience</p>'
    };

    const { container } = render(<About {...props} />);
    
    const section = container.querySelector('#about');
    expect(section?.innerHTML).toBe('<h2>John Doe</h2><p>Full Stack Developer with 5 years of experience</p>');
  });

  it('should handle empty aboutUserData', () => {
    const props: IAboutProps = {
      aboutUserData: ''
    };

    const { container } = render(<About {...props} />);
    
    const section = container.querySelector('#about');
    expect(section).toBeInTheDocument();
    expect(section?.innerHTML).toBe('');
  });

  it('should handle plain text content', () => {
    const props: IAboutProps = {
      aboutUserData: 'This is plain text about me'
    };

    const { container } = render(<About {...props} />);
    
    const section = container.querySelector('#about');
    expect(section?.innerHTML).toBe('This is plain text about me');
  });

  it('should handle markdown-like content', () => {
    const props: IAboutProps = {
      aboutUserData: '# About Me\n\nI am a **developer** who loves coding!'
    };

    const { container } = render(<About {...props} />);
    
    const section = container.querySelector('#about');
    expect(section?.innerHTML).toBe('# About Me\n\nI am a **developer** who loves coding!');
  });

  it('should render with correct CSS classes', () => {
    const props: IAboutProps = {
      aboutUserData: '<p>Test content</p>'
    };

    render(<About {...props} />);
    
    const section = screen.getByRole('region', { name: /about/i });
    expect(section).toHaveClass('tw:px-10', 'tw:lg:px-20');
  });

  it('should handle complex HTML structures', () => {
    const props: IAboutProps = {
      aboutUserData: `
        <div>
          <h2>Experience</h2>
          <ul>
            <li>React Development</li>
            <li>Node.js Backend</li>
          </ul>
          <p>Contact: <a href="mailto:test@example.com">test@example.com</a></p>
        </div>
      `
    };

    const { container } = render(<About {...props} />);
    
    const section = container.querySelector('#about');
    expect(section).toBeInTheDocument();
    
    // Check that HTML elements are properly rendered
    const heading = section?.querySelector('h2');
    const list = section?.querySelector('ul');
    const listItems = section?.querySelectorAll('li');
    const link = section?.querySelector('a');
    
    expect(heading).toBeInTheDocument();
    expect(list).toBeInTheDocument();
    expect(listItems).toHaveLength(2);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'mailto:test@example.com');
  });

  it('should handle HTML with attributes', () => {
    const props: IAboutProps = {
      aboutUserData: '<p class="highlight" data-test="about-text">Welcome to my portfolio</p>'
    };

    const { container } = render(<About {...props} />);
    
    const section = container.querySelector('#about');
    const paragraph = section?.querySelector('p');
    
    expect(paragraph).toHaveClass('highlight');
    expect(paragraph).toHaveAttribute('data-test', 'about-text');
  });

  it('should be accessible with section role', () => {
    const props: IAboutProps = {
      aboutUserData: '<h2>Accessibility Test</h2>'
    };

    render(<About {...props} />);
    
    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'about');
  });

  it('should handle special characters in content', () => {
    const props: IAboutProps = {
      aboutUserData: '<p>Special chars: &amp; &lt; &gt; &quot; &#39;</p>'
    };

    const { container } = render(<About {...props} />);
    
    const section = container.querySelector('#about');
    expect(section?.innerHTML).toBe('<p>Special chars: &amp; &lt; &gt; &quot; &#39;</p>');
  });

  it('should maintain HTML structure integrity', () => {
    const complexHTML = `
      <article>
        <header>
          <h1>About John Doe</h1>
          <time datetime="2023-01-01">Updated: January 2023</time>
        </header>
        <section>
          <h2>Background</h2>
          <p>Software engineer with passion for <em>clean code</em> and <strong>best practices</strong>.</p>
        </section>
        <footer>
          <p>Find me on <a href="https://github.com/johndoe" target="_blank" rel="noopener">GitHub</a></p>
        </footer>
      </article>
    `;

    const props: IAboutProps = {
      aboutUserData: complexHTML
    };

    const { container } = render(<About {...props} />);
    
    const section = container.querySelector('#about');
    const article = section?.querySelector('article');
    const header = section?.querySelector('header');
    const footer = section?.querySelector('footer');
    
    expect(article).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
    
    const link = section?.querySelector('a');
    expect(link).toHaveAttribute('href', 'https://github.com/johndoe');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
  });
});