# Quick Start Guide

## 30-Second Setup

1. **Install Node.js** if you don't have it
2. **Install Power BI Visual Tools:**
   ```bash
   npm install -g powerbi-visuals-tools
   ```

3. **Navigate to project folder and install dependencies:**
   ```bash
   npm install
   ```

4. **Start development:**
   ```bash
   npm start
   ```

5. **Open Power BI Desktop** - the custom visual will auto-load in developer mode

## Using the Visual

1. **Drag fields** from your data:
   - Customer Name → **Customer**
   - Sales Amount → **Sales/Revenue**

2. **Format** in the **Format** pane:
   - Change bar color
   - Set top N customers (default: 10)
   - Toggle value labels on/off

## Building for Distribution

```bash
npm run package
```

Find your `.pbiviz` file in the `dist/` folder.

## Key Files to Modify

- **`src/visual.ts`** - Main chart logic
- **`src/settings.ts`** - Configuration options
- **`capabilities.json`** - Data field requirements
- **`style/visual.less`** - Styling

## Need Help?

See `SETUP.md` for detailed documentation and troubleshooting.
