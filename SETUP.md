# Customer Sales Chart - Power BI Custom Visual

A custom Power BI visual that displays top customers by sales/revenue in an interactive bar chart.

## Features

✅ **Top Customers Display** - Automatically shows top N customers sorted by sales  
✅ **Interactive Bars** - Hover effects for better visibility  
✅ **Value Labels** - Optional display of sales amounts on bars  
✅ **Customizable Colors** - Change bar color via formatting panel  
✅ **Responsive Design** - Adapts to different container sizes  

## Prerequisites

Before you start, install:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **Power BI Desktop** - [Download](https://powerbi.microsoft.com/downloads/)

## Installation & Setup

### Step 1: Install Power BI Visual Tools

Open Command Prompt or PowerShell and run:

```bash
npm install -g powerbi-visuals-tools
```

Verify installation:

```bash
pbiviz --version
```

### Step 2: Create Visual from Template (Alternative)

If you prefer to use the project template instead of manual setup:

```bash
pbiviz new CustomerSalesChart
cd CustomerSalesChart
```

Then replace the files with the ones provided above.

### Step 3: Install Dependencies

```bash
cd path/to/your/visual/project
npm install
```

### Step 4: Start Development Mode

```bash
npm start
```

This will:
- Start a local HTTPS server
- Generate a self-signed certificate
- Open Power BI Desktop with developer visual enabled

## Building the Visual

### Development Build

```bash
npm run build
```

Output: `./dist/customerSalesChart.pbiviz`

### Package for Production

```bash
npm run package
```

## Using the Visual in Power BI

### In Developer Mode (During Development)

1. Start development server: `npm start`
2. In Power BI Desktop, the visual appears in the **Visualizations pane**
3. Drag fields to:
   - **Customer** (Category) - Customer names
   - **Sales/Revenue** (Measure) - Sales or revenue values

### In Production

1. Package the visual: `npm run package`
2. In Power BI Desktop: **Insert** → **Get more visuals** → **Import from file**
3. Select the `.pbiviz` file from `./dist/`
4. Use it in your reports

## Configuration Options

In the **Format** pane, you can configure:

| Setting | Type | Description |
|---------|------|-------------|
| Bar Color | Color | Change the bar chart color |
| Top N Customers | Number | Display top 5, 10, 20, etc. customers |
| Show Value Labels | Toggle | Display sales amounts on bars |

## Data Requirements

- **Minimum**: 1 customer name field + 1 sales/revenue measure
- **Recommended**: 
  - Customer Name (Dimension)
  - Sales Amount, Revenue, or Count (Measure)

### Example Data Structure

| Customer | Sales |
|----------|-------|
| Acme Corp | 150000 |
| TechStart Inc | 125000 |
| Global Ltd | 98000 |

## Troubleshooting

### "npm command not found"
- Ensure Node.js is installed and in your PATH
- Restart your terminal after installation

### Certificate warning in browser
- This is normal for development. Accept the self-signed certificate
- Certificate is generated automatically by pbiviz

### Visual not appearing in Power BI
- Ensure development server is running (`npm start`)
- Check Power BI Desktop settings: **File** → **Options** → **Security** → Enable developer visual

### Build errors
- Delete `node_modules` and run `npm install` again
- Ensure TypeScript version matches: `npm install --save-dev typescript@^4.9.0`

## Project Structure

```
project/
├── src/
│   ├── visual.ts          # Main visual implementation
│   └── settings.ts        # Configuration/formatting options
├── style/
│   └── visual.less        # Visual styling
├── assets/
│   └── icon.png           # Visual icon (128x128)
├── capabilities.json      # Data mappings & features
├── pbiviz.json           # Visual metadata
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── SETUP.md             # This file
```

## Customization Guide

### Change Visual Appearance

Edit `src/visual.ts`:
```typescript
private margin = { top: 20, right: 30, bottom: 60, left: 60 }; // Adjust spacing
```

### Add New Formatting Options

1. Add property to `src/settings.ts`:
```typescript
public newOption: string = "default";
```

2. Add to `capabilities.json`:
```json
"newOption": {
  "displayName": "New Option",
  "type": { "text": true }
}
```

3. Use in `src/visual.ts`:
```typescript
const value = this.settings.dataPoint.newOption;
```

### Modify Chart Type

To change from bar to column, pie, or scatter:
- Modify the D3 scales and shapes in `renderChart()`
- Update data binding in the `.selectAll(".bar")` section

## Publishing to AppSource

For official Power BI marketplace:

1. Create a Power BI visuals developer account
2. Prepare marketing assets (screenshots, descriptions)
3. Submit through Power BI Visuals Marketplace
4. Follow [official documentation](https://learn.microsoft.com/power-bi/developer/visuals/submission-guidelines)

## Resources

- [Power BI Visuals Documentation](https://learn.microsoft.com/power-bi/developer/visuals/)
- [D3.js Guide](https://d3js.org/)
- [Power BI Visuals API Reference](https://learn.microsoft.com/javascript/api/power-bi-visuals-api/modules)
- [Sample Visuals Repository](https://github.com/Microsoft/PowerBI-visuals)

## License

Modify the license as needed (MIT, Apache 2.0, etc.)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Power BI official documentation
3. Check the visual's repository for updates
