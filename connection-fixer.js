// connection-fixer.js - Add this as a new file to your project

document.addEventListener('DOMContentLoaded', function() {
    // Wait for the DOM to be fully loaded and initialized
    setTimeout(createDynamicConnectionLines, 1000);
});

function createDynamicConnectionLines() {
    // First, remove the original SVG that's not working
    const oldSvg = document.querySelector('.connection-lines');
    if (oldSvg) {
        oldSvg.remove();
    }
    
    // Create a new SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'connection-lines');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.zIndex = '1';
    svg.style.pointerEvents = 'none';
    
    // Add the new SVG as the first child in the container
    const container = document.querySelector('.talent-tree-container');
    if (container.firstChild) {
        container.insertBefore(svg, container.firstChild);
    } else {
        container.appendChild(svg);
    }
    
    // Create the predefined connections
    createPredefinedConnections(svg);
    
    // Make connections visible with inline styles
    applyInlineStyles();
    
    console.log('Dynamic connection lines created');
}

function createPredefinedConnections(svg) {
    // BRAVERY Path (Right)
    createSvgLine(svg, '50%', '50%', '67%', '50%', 'bravery');
    createSvgLine(svg, '67%', '50%', '67%', '30%', 'bravery');
    createSvgLine(svg, '67%', '50%', '67%', '70%', 'bravery');
    createSvgLine(svg, '67%', '30%', '67%', '15%', 'bravery');
    createSvgLine(svg, '67%', '70%', '67%', '85%', 'bravery');
    
    // Secondary connections - Bravery
    createSvgLine(svg, '67%', '15%', '82%', '15%', 'bravery');
    createSvgLine(svg, '67%', '30%', '82%', '30%', 'bravery');
    createSvgLine(svg, '67%', '85%', '82%', '85%', 'bravery');
    createSvgLine(svg, '67%', '70%', '82%', '70%', 'bravery');
    
    // Final tier connections - Bravery
    createSvgLine(svg, '82%', '15%', '82%', '30%', 'bravery');
    createSvgLine(svg, '82%', '30%', '93%', '30%', 'bravery');
    createSvgLine(svg, '82%', '70%', '82%', '85%', 'bravery');
    createSvgLine(svg, '82%', '85%', '93%', '85%', 'bravery');
    
    // HUMILITY Path (Left)
    createSvgLine(svg, '50%', '50%', '33%', '50%', 'humility');
    createSvgLine(svg, '33%', '50%', '33%', '30%', 'humility');
    createSvgLine(svg, '33%', '50%', '33%', '70%', 'humility');
    createSvgLine(svg, '33%', '30%', '33%', '15%', 'humility');
    createSvgLine(svg, '33%', '70%', '33%', '85%', 'humility');
    
    // Secondary connections - Humility
    createSvgLine(svg, '33%', '15%', '18%', '15%', 'humility');
    createSvgLine(svg, '33%', '30%', '18%', '30%', 'humility');
    createSvgLine(svg, '33%', '85%', '18%', '85%', 'humility');
    createSvgLine(svg, '33%', '70%', '18%', '70%', 'humility');
    
    // Final tier connections - Humility
    createSvgLine(svg, '18%', '15%', '18%', '30%', 'humility');
    createSvgLine(svg, '18%', '30%', '7%', '30%', 'humility');
    createSvgLine(svg, '18%', '70%', '18%', '85%', 'humility');
    createSvgLine(svg, '18%', '85%', '7%', '85%', 'humility');
    
    // MIXED Path (Center)
    createSvgLine(svg, '50%', '50%', '50%', '35%', 'mixed');
    createSvgLine(svg, '50%', '50%', '50%', '65%', 'mixed');
    createSvgLine(svg, '50%', '35%', '50%', '20%', 'mixed');
    createSvgLine(svg, '50%', '65%', '50%', '80%', 'mixed');
    createSvgLine(svg, '50%', '20%', '50%', '7%', 'mixed');
    
    // Cross connections for requirements
    createSvgLine(svg, '93%', '30%', '50%', '7%', 'mixed-req');
    createSvgLine(svg, '7%', '30%', '50%', '7%', 'mixed-req');
    createSvgLine(svg, '50%', '20%', '93%', '30%', 'mixed-req');
    createSvgLine(svg, '50%', '20%', '7%', '30%', 'mixed-req');
}

function createSvgLine(svg, x1, y1, x2, y2, type) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('class', 'connection-line ' + type);
    svg.appendChild(line);
}

function applyInlineStyles() {
    const lines = document.querySelectorAll('.connection-line');
    
    lines.forEach(line => {
        // Set base styles for all lines
        line.style.strokeWidth = '4px';
        line.style.strokeLinecap = 'round';
        line.style.fill = 'none';
        line.style.opacity = '0.7';
        
        // Add specific styles based on class
        if (line.classList.contains('bravery')) {
            line.style.stroke = '#ff8c00';
        } else if (line.classList.contains('humility')) {
            line.style.stroke = '#1e90ff';
        } else if (line.classList.contains('mixed')) {
            line.style.stroke = '#ffffff';
        } else if (line.classList.contains('mixed-req')) {
            line.style.stroke = '#a64aff';
            line.style.strokeDasharray = '5, 5';
        }
        
        // Add filter for glow effect
        line.style.filter = 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.3))';
    });
}

// Update connections when panning/zooming
function updateConnectionsForPanZoom() {
    const svg = document.querySelector('.connection-lines');
    if (svg && window.currentTranslate && window.scale) {
        svg.style.transform = `translate(${window.currentTranslate.x}px, ${window.currentTranslate.y}px) scale(${window.scale})`;
    }
}

// Make our updateConnectionsForPanZoom function global so it can be called from script.js
window.updateConnectionsForPanZoom = updateConnectionsForPanZoom;