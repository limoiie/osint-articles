# OSINT Articles Viewer

A modern, responsive web application for browsing and analyzing OSINT news articles stored in YAML format. Built with Next.js 16, TypeScript, shadcn-ui, and Tailwind CSS v4.

## Features

- **Data File Browser**: Home page displays all YAML data files as interactive cards
- **Article List View**: Browse articles from each data file with rich previews
- **Interactive Cards**: 
  - Hover to preview article summary, metadata, and key points
  - Click to view full markdown content in a side sheet
  - External link button to open original article
- **Rich Article Display**:
  - Title, thumbnail, snippet, relevance score
  - Source, authors, categories, tags
  - Full markdown content rendering
- **Dark Mode**: System-aware theme with manual toggle
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Accessibility**: Keyboard navigation, ARIA labels, focus states

## Tech Stack

- **Framework**: Next.js 16 (App Router with React Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn-ui (Radix UI primitives)
- **Icons**: Lucide React
- **Markdown**: react-markdown with remark-gfm
- **YAML Parsing**: yaml
- **Date Formatting**: date-fns

## Project Structure

```
.
├── app/
│   ├── api/data/[filename]/    # API route for YAML data
│   ├── articles/[filename]/    # Dynamic article list page
│   ├── layout.tsx              # Root layout with theme provider
│   └── page.tsx                # Home page (data files list)
├── components/
│   ├── ui/                     # shadcn-ui components
│   ├── ArticleCard.tsx         # Article card with hover preview
│   ├── ArticleSheet.tsx        # Sheet for full article view
│   ├── theme-provider.tsx      # Theme provider wrapper
│   └── theme-toggle.tsx        # Dark/light mode toggle
├── data/                       # YAML data files
├── lib/
│   ├── types.ts                # TypeScript type definitions
│   └── yaml-utils.ts           # YAML parsing utilities
└── public/                     # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Add YAML data files to the `data/` directory

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
pnpm build
pnpm start
```

## YAML Data Format

Place YAML files in the `data/` directory with the following structure:

```yaml
name: Your Collection Name
metadata:
  query: Search query used
  processed_at: "2025-12-06T00:00:00.000000"
  total_articles: 10
  successful: 10
articles:
  - url: https://example.com/article
    original_title: Article Title
    original_snippet: Brief description...
    thumbnail_url: https://example.com/image.jpg
    relevance_score: 8.5
    relevance_interpretation: Why this is relevant...
    rank: 1
    article:
      title: Article Title
      summary: Detailed summary...
      source: Source Name
      published_date: "2025-12-06T10:00:00Z"
      updated_date: "2025-12-06T12:00:00Z"
      authors: []
      categories: []
      tags: []
      key_points:
        - Key point 1
        - Key point 2
    markdown_content: |
      Full article content in markdown...
```

## Features in Detail

### Home Page
- Grid layout of data file cards
- Each card shows file name, query, date, and article count
- Click any card to navigate to its articles

### Article List Page
- Breadcrumb navigation
- Responsive grid of article cards
- Each card displays:
  - Thumbnail with error handling
  - Title and snippet
  - Relevance score with progress bar
  - Source and rank badges
  - External link icon

### Hover Preview
- Hover over any article card to see:
  - Full summary
  - Publication dates
  - Authors, categories, tags
  - Key points list

### Article Sheet
- Opens from the right side
- Renders full markdown content
- Syntax highlighting for code blocks
- Responsive tables and images
- Smooth scroll area

### Accessibility
- Keyboard navigation support
- ARIA labels and roles
- Focus visible states
- Semantic HTML structure
- Alt text for images

## License

MIT
