import { render, screen } from '@testing-library/react';
import LowCodeProjects from '../organisms/LowCodeProjects';
import { ILowCodeProjectsProps, ILowCodeProject } from '@/interfaces/low-code-projects';

// Mock the N8NWorkflow component since it has external dependencies
jest.mock('@/components/molecules/N8NWorkflow', () => {
  return function MockN8NWorkflow({ workflow }: { workflow: ILowCodeProject }) {
    return (
      <div data-testid={`workflow-${workflow.id}`}>
        <h3>{workflow.name}</h3>
        <div>Mocked N8N Workflow</div>
      </div>
    );
  };
});

describe('LowCodeProjects Component', () => {
  const mockProjects: ILowCodeProject[] = [
    {
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      id: '1',
      name: 'Test Workflow 1',
      active: true,
      nodes: [],
      connections: {},
      settings: {},
      staticData: {},
      meta: {},
      pinData: {},
      versionId: 'v1',
      triggerCount: 5,
      shared: [],
      tags: []
    },
    {
      createdAt: '2023-01-03T00:00:00Z',
      updatedAt: '2023-01-04T00:00:00Z',
      id: '2',
      name: 'Test Workflow 2',
      active: false,
      nodes: [],
      connections: {},
      settings: {},
      staticData: {},
      meta: {},
      pinData: {},
      versionId: 'v2',
      triggerCount: 0,
      shared: [],
      tags: []
    }
  ];

  const defaultProps: ILowCodeProjectsProps = {
    projects: mockProjects
  };

  it('should render low-code projects section with heading', () => {
    const { container } = render(<LowCodeProjects {...defaultProps} />);
    
    const section = container.querySelector('#low-code-projects');
    expect(section).toBeTruthy();
    expect(section?.tagName.toLowerCase()).toBe('section');
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe('Low-code/No-code Projects');
  });

  it('should render all workflow components', () => {
    render(<LowCodeProjects {...defaultProps} />);
    
    const workflow1 = screen.getByTestId('workflow-1');
    const workflow2 = screen.getByTestId('workflow-2');
    
    expect(workflow1).toBeTruthy();
    expect(workflow2).toBeTruthy();
    
    expect(workflow1.textContent).toContain('Test Workflow 1');
    expect(workflow2.textContent).toContain('Test Workflow 2');
  });

  it('should handle empty projects array', () => {
    const emptyProps: ILowCodeProjectsProps = {
      projects: []
    };

    render(<LowCodeProjects {...emptyProps} />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toBe('Low-code/No-code Projects');
    
    const workflows = screen.queryAllByTestId(/^workflow-/);
    expect(workflows.length).toBe(0);
  });

  it('should handle single project', () => {
    const singleProjectProps: ILowCodeProjectsProps = {
      projects: [mockProjects[0]]
    };

    render(<LowCodeProjects {...singleProjectProps} />);
    
    const workflows = screen.getAllByTestId(/^workflow-/);
    expect(workflows.length).toBe(1);
    
    const workflow = screen.getByTestId('workflow-1');
    expect(workflow.textContent).toContain('Test Workflow 1');
  });

  it('should render with correct CSS classes', () => {
    const { container } = render(<LowCodeProjects {...defaultProps} />);
    
    const section = container.querySelector('#low-code-projects');
    expect(section?.className).toContain('tw:grid');
    expect(section?.className).toContain('tw:grid-cols-1');
    expect(section?.className).toContain('tw:px-10');
    expect(section?.className).toContain('tw:lg:px-20');
    expect(section?.className).toContain('tw:gap-4');
    
    const heading = container.querySelector('h2');
    expect(heading?.className).toContain('tw:text-3xl');
    
    const projectsGrid = container.querySelector('div.tw\\:grid-cols-1');
    expect(projectsGrid?.className).toContain('tw:lg:grid-cols-2');
  });

  it('should pass workflow data to N8NWorkflow components', () => {
    render(<LowCodeProjects {...defaultProps} />);
    
    // Since we're mocking the N8NWorkflow component, we can verify it receives the correct data
    const workflow1Heading = screen.getByText('Test Workflow 1');
    const workflow2Heading = screen.getByText('Test Workflow 2');
    
    expect(workflow1Heading).toBeTruthy();
    expect(workflow2Heading).toBeTruthy();
  });

  it('should use project id as key for N8NWorkflow components', () => {
    const { container } = render(<LowCodeProjects {...defaultProps} />);
    
    // We can't directly test React keys, but we can verify that each project is rendered with correct id
    const workflow1 = container.querySelector('[data-testid="workflow-1"]');
    const workflow2 = container.querySelector('[data-testid="workflow-2"]');
    
    expect(workflow1).toBeTruthy();
    expect(workflow2).toBeTruthy();
  });

  it('should render projects in correct order', () => {
    render(<LowCodeProjects {...defaultProps} />);
    
    const workflows = screen.getAllByTestId(/^workflow-/);
    expect(workflows.length).toBe(2);
    
    // Check that they appear in the order they were provided
    expect(workflows[0].getAttribute('data-testid')).toBe('workflow-1');
    expect(workflows[1].getAttribute('data-testid')).toBe('workflow-2');
  });

  it('should handle projects with different properties', () => {
    const diverseProjects: ILowCodeProject[] = [
      {
        ...mockProjects[0],
        name: 'Active Workflow',
        active: true,
        triggerCount: 100
      },
      {
        ...mockProjects[1],
        name: 'Inactive Workflow',
        active: false,
        triggerCount: 0
      }
    ];

    const diverseProps: ILowCodeProjectsProps = {
      projects: diverseProjects
    };

    render(<LowCodeProjects {...diverseProps} />);
    
    const activeWorkflow = screen.getByText('Active Workflow');
    const inactiveWorkflow = screen.getByText('Inactive Workflow');
    
    expect(activeWorkflow).toBeTruthy();
    expect(inactiveWorkflow).toBeTruthy();
  });
});