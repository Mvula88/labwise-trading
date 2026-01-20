# Labwise Trading cc - Website

Professional website for Labwise Trading cc, a trusted supplier of laboratory and scientific equipment in Namibia.

## About

Labwise Trading cc is a Namibia-based supplier of laboratory equipment, scientific instruments, medical supplies, and STEAM & robotics solutions, serving schools, universities, laboratories, clinics, and research institutions nationwide.

## Website Features

### Design
- Modern, clean, and professional interface
- Brand colors: Primary (#073b4c), Secondary (#1b7bb2)
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Accessibility-focused

### Sections
1. **Hero Section** - Eye-catching introduction with key statistics
2. **About** - Company mission and values
3. **Products** - Comprehensive product catalog organized by category:
   - Laboratory Equipment
   - Laboratory Glassware
   - Laboratory Plasticware
   - Laboratory Consumables
   - STEAM & Robotics
   - Reagents & Chemicals
4. **Services** - Client segments served
5. **Why Choose Us** - Company benefits and advantages
6. **Quote Request** - Interactive form for quote requests
7. **Contact** - Complete contact information

### Interactive Features
- Fixed navigation with scroll effects
- Mobile-friendly hamburger menu
- Smooth scroll navigation
- Animated statistics counter
- Form validation
- Scroll-to-top button
- Intersection Observer animations

## File Structure

```
labwise/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet with brand colors
├── script.js           # JavaScript for interactivity
├── images/             # Directory for images and assets
│   └── (Place your images here)
└── README.md           # This file
```

## Setup Instructions

### Local Development

1. **Clone or download the repository**
   ```bash
   cd /home/user/labwise
   ```

2. **No build process required** - This is a static website that runs directly in the browser

3. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server for better development experience

### Using a Local Server

#### Option 1: Python HTTP Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then visit: `http://localhost:8000`

#### Option 2: Node.js http-server
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server -p 8000
```
Then visit: `http://localhost:8000`

#### Option 3: VS Code Live Server
- Install "Live Server" extension in VS Code
- Right-click on `index.html`
- Select "Open with Live Server"

## Customization

### Adding Your Logo
1. Place your logo image in the `images/` directory
2. Update the logo section in `index.html`:
   ```html
   <div class="logo">
       <a href="#home">
           <img src="images/your-logo.png" alt="Labwise Trading" height="40">
       </a>
   </div>
   ```

### Adding Product Images
1. Place product images in the `images/` directory
2. Add image tags to the product categories in `index.html`
3. Example:
   ```html
   <div class="category-image">
       <img src="images/product-category.jpg" alt="Product Category">
   </div>
   ```

### Updating Colors
Brand colors are defined in `styles.css` CSS variables:
```css
:root {
    --primary-color: #073b4c;
    --secondary-color: #1b7bb2;
    /* Modify these to change the entire color scheme */
}
```

### Modifying Content
All content is in `index.html`. Simply edit the text within the HTML tags to update:
- Company information
- Product lists
- Contact details
- Any other text content

## Deployment

### Option 1: GitHub Pages (Free)
1. Push code to GitHub repository
2. Go to repository Settings > Pages
3. Select branch and root folder
4. Your site will be live at `https://yourusername.github.io/labwise`

### Option 2: Netlify (Free)
1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop the entire folder
3. Your site will be live instantly with a custom domain option

### Option 3: Traditional Web Hosting
1. Upload all files via FTP/SFTP to your hosting provider
2. Ensure `index.html` is in the root directory
3. Configure your domain to point to the hosting

### Option 4: Vercel (Free)
1. Create account at [vercel.com](https://vercel.com)
2. Import your GitHub repository or upload files
3. Deploy with one click

## Browser Compatibility

This website is compatible with:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## SEO Optimization

The website includes:
- Semantic HTML5 markup
- Meta descriptions and keywords
- Proper heading hierarchy
- Alt text for images (when added)
- SEO-friendly footer with keywords
- Mobile-responsive design
- Fast loading times

### Recommended SEO Improvements
1. Add a `sitemap.xml` file
2. Add a `robots.txt` file
3. Implement Open Graph meta tags for social sharing
4. Add structured data (Schema.org) for business information
5. Optimize image file sizes and add alt text

## Performance Optimization

Current optimizations:
- Minimal external dependencies
- Efficient CSS with CSS variables
- Debounced scroll events
- Intersection Observer for animations
- Lazy loading ready structure

### Additional Recommendations
1. Minify CSS and JavaScript for production
2. Compress images before uploading
3. Enable GZIP compression on server
4. Implement caching headers
5. Consider adding a CDN for faster global delivery

## Contact Information

**Labwise Trading cc**
- 📍 Location: Ongwediva, Namibia
- 📞 Phone/WhatsApp: +264 81 440 1522
- 📧 Email: labwisetradingcc@gmail.com
- 🌐 Website: www.labwise-trading.com

## Future Enhancements

Potential features to add:
- [ ] Online product catalog with search functionality
- [ ] Shopping cart and e-commerce capabilities
- [ ] Customer testimonials section
- [ ] Blog/News section
- [ ] Multi-language support (English + local languages)
- [ ] Live chat integration
- [ ] WhatsApp Business API integration
- [ ] Product image galleries
- [ ] Client portfolio/case studies
- [ ] Newsletter subscription
- [ ] Social media integration

## Technical Support

For technical issues or questions about the website:
- Create an issue in the repository
- Contact: labwisetradingcc@gmail.com

## License

© 2026 Labwise Trading cc. All rights reserved.

## Credits

- Design & Development: Custom built for Labwise Trading cc
- Fonts: Inter (Google Fonts)
- Icons: Unicode emoji characters (no external dependencies)

---

**Built with ❤️ for Labwise Trading cc**

For any updates or modifications to the website, refer to this README or contact the development team.
