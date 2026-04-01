import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Header from './header.astro';

test('should render header component', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Header, {
        
    });

    expect(result).toContain('Learning Astro');
});