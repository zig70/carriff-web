import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { DOMPURIFY_TOKEN } from '../../providers/dompurify-token';
import { SeoService } from './../../seo.service';

    
let domPurifyInstance: any = null;

interface Article {
  title: string;
  category: string;
  summary: string;
  imageUrl: string;
  fullContent: string | SafeHtml; // <-- Added property for the full content
  slug: string;        // <-- Added property for linking/finding
}

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  standalone: true,
  imports: [RouterLink, NgOptimizedImage]
})
export class ArticleComponent implements OnInit {
article: Article | undefined; 

  // Inject ActivatedRoute into the constructor
  constructor(private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private seoService: SeoService,
  ) { }

 domPurifyInstance: any = inject(DOMPURIFY_TOKEN, { optional: true }) 

  ngOnInit(): void {
    // 1. Subscribe to changes in the URL parameters
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchArticleData(slug);
      }
    });
  }

  // --- MOCK DATA SOURCE (Replace with a real service later) ---
  private mockArticles: Article[] = [
    {
      title: 'The 5 Pillars of a Modern Data Governance Framework',
      category: 'Data Governance',
      summary: 'An essential guide...',
      imageUrl: 'assets/blog-thumbnails/datagovblogimage.webp',
      // Ensure the slug matches the URL path!
      slug: 'the-5-pillars-of-modern-data-governance-framework', 
      fullContent: `<p>In today's data-intensive landscape, a robust Data Governance (DG) framework is no longer a luxury, it's a necessity. It ensures that data is high-quality, secure, private, and accessible for business value. A modern DG framework moves beyond rigid, compliance-only practices to become an enabler of data innovation.</p>

    <p>Here are the five essential pillars that form the foundation of a contemporary, effective Data Governance strategy:</p>

    <hr>

    <h2>1. People & Organizational Structure</h2>
    <p>This pillar defines who is responsible for data. Effective governance requires a clear definition of roles and responsibilities. This includes establishing a Data Governance Office (DGO), appointing Data Owners (who have ultimate accountability for a data domain), Data Stewards (who manage and implement policies day-to-day), and a cross-functional Steering Committee to drive strategy. Governance is a team sport, requiring collaboration between IT, Legal, Compliance, and Business Units.</p>

    <h2>2. Policies & Standards</h2>
    <p>This is the rulebook for how data should be treated across its lifecycle. It encompasses the formal documentation that ensures data is used legally, ethically, and consistently. Key policies include:</p>
    <ul>
        <li>Data Quality Standards: Defining metrics and processes for data accuracy, completeness, and timeliness.</li>
        <li>Privacy & Security Policies: Outlining compliance with regulations like GDPR or HIPAA.</li>
        <li>Data Retention & Archival: Governing how long data must be kept and how it should be disposed of.</li>
    </ul>

    <h2>3. Processes & Execution</h2>
    <p>This pillar focuses on the how—the repeatable, documented workflows that operationalize the policies and standards. This includes processes for:</p>
    <ul>
        <li>Data Lineage Tracking: Mapping the data journey from source to consumption.</li>
        <li>Data Access Request Management: Governing the approval and provisioning of data access.</li>
        <li>Issue Resolution: A formal process for identifying, escalating, and resolving data quality or policy breaches.</li>
    </ul>

    <h2>4. Technology & Architecture</h2>
    <p>Technology is the toolset that automates and enforces the governance rules. A modern framework leverages technology to scale DG efforts. Essential tools include:</p>
    <ul>
        <li>Data Catalog: A central inventory of all data assets, complete with metadata, glossary terms, and lineage.</li>
        <li>Data Quality Tools: Software to monitor, profile, and remediate data issues automatically.</li>
        <li>Master Data Management (MDM): Systems to create and maintain a single, trusted version of core business entities (e.g., customers, products).</li>
    </ul>

    <h2>5. Data Value & Culture</h2>
    <p>The final, and perhaps most critical, pillar ensures that governance is adopted and aligned with business goals. A strong Data Culture means that employees view data as a strategic asset and understand their role in protecting and enhancing it. This pillar involves:</p>
    <ul>
        <li>Data Literacy Training: Educating employees on data concepts and policies.</li>
        <li>Measuring Value: Demonstrating the ROI of governance (e.g., better compliance scores, reduced data errors, faster time-to-insight).</li>
        <li>Communication: Continuously promoting the benefits and successes of the DG program.</li>
    </ul>

    <hr>

    <p>A successful Data Governance framework integrates these five pillars to create a cohesive environment. It transforms governance from a restrictive checklist into a dynamic, value generating capability that empowers the business to make smarter, safer decisions.</p>` 
    },
    {
      title: 'Beyond Chatbots: Using AI for Hyper-Personalized Marketing',
      category: 'AI & Automation',
      summary: 'An essential guide...',
      imageUrl: 'assets/blog-thumbnails/blogreporting.webp',
      // Ensure the slug matches the URL path!
      slug: 'beyond-chatbots-using-ai-for-hyper-personalized-marketing', 
      fullContent: `<p>The conversation around Artificial Intelligence in marketing often begins and ends with automated customer service (chatbots). While these tools are valuable, they only scratch the surface of AI's potential. Today, advanced Machine Learning (ML) is fundamentally shifting how businesses connect with consumers, moving far past generic segmentation toward true hyper-personalization.</p>
    <h3>The Power of Predictive Analytics</h3>
    <p>AI's real impact lies in its ability to process vast, disparate data sets to transaction histories, browsing behavior, social media engagement, and real-time location to create incredibly accurate customer profiles. This enables predictive modeling that forecasts individual customer needs and intent before the customer even knows it themselves.</p>
    <p>Instead of simply grouping customers by age or income, AI allows marketers to:</p>
    <ul>
        <li>Predict Churn Risk: Identifying specific users likely to leave in the next 30 days, allowing for targeted retention campaigns.</li>
        <li>Optimize Pricing: Setting the ideal price point for a specific product for an individual user at a specific time, maximizing conversion and margin.</li>
        <li>Determine Next Best Action (NBA): Automatically serving the most relevant content, product recommendation, or communication channel (email, SMS, app notification) to guide the customer along their unique journey.</li>
    </ul>
    <h3>Dynamic Content and Creative Optimization</h3>
    <p>Hyper-personalization is about more than just addressing a customer by name. It involves dynamic creative optimization, where every element of an advertisement, email, or website landing page is tailored in real-time. AI systems can automatically test thousands of variations of headlines, images, calls-to-action, and even background colors to find the optimal combination for each viewer. This level of granular customization drastically increases engagement and conversion rates, ensuring that the right message reaches the right person at the exact moment of need.</p>
    <h3>Scaling the One-to-One Experience</h3>
    <p>The ultimate goal is to scale a "one-to-one" marketing experience across millions of customers simultaneously, a task impossible for human marketers. By moving beyond static automation and embracing the analytical and generative capabilities of modern AI, businesses can build deeper, more meaningful customer relationships that feel intuitive, timely, and genuine. This shift defines the future of customer experience.</p>` 
    },
    {
      title: 'What we have been listening to in 2025',
      category: 'AI & Automation',
      summary: 'An essential guide...',
      imageUrl: 'assets/blog-thumbnails/topofthepops.webp',
      // Ensure the slug matches the URL path!
      slug: 'transforming-customer-onboarding-40-efficiency-gain', 
      fullContent: `<p>Here is a look at five essential podcasts dominating our playlists this year:</p>

    <div class="podcast-item">
        <h3>1. The AI Daily Brief</h3>
        <p>Your essential daily dose of AI news, cutting through the hype to deliver practical analysis on market moves, policy changes, and the latest product launches. Perfect for busy executives and developers who need to stay informed in under 15 minutes.</p>
        <div class="embed-container">
            <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/show/7gKwwMLFLc6RmjmRpbMtEO/video?utm_source=generator" width="624" height="351" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
    </div>

    <div class="podcast-item">
        <h3>2. The Cloud Pod</h3>
        <p>A weekly, vendor-agnostic discussion that covers all major cloud platforms—AWS, Azure, and GCP. The hosts provide expert commentary on architecture, cost optimization, and the critical decisions shaping enterprise cloud strategy.</p>
        <div class="embed-container">
            <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/show/414Xd3q3oqRdSuMa61cUZg?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
    </div>

    <div class="podcast-item">
        <h3>3. Instech Podcast</h3>
        <p>Focused on the intersection of technology and insurance, this podcast provides unique insights into how AI, blockchain, and data analytics are transforming underwriting, claims processing, and customer experience in the financial sector.</p>
        <div class="embed-container">
            <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/show/0iP4kU23bPqjgFKKJo4LOi?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
    </div>

    <div class="podcast-item">
        <h3>4. Practical AI</h3>
        <p>Living up to its name, this show demystifies machine learning and deep learning, making complex concepts accessible. It focuses heavily on real-world implementation, providing actionable steps for engineers and business leaders looking to integrate AI into their products.</p>
        <div class="embed-container">
            <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/show/1LaCr5TFAgYPK5qHjP3XDp?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
    </div>

    <div class="podcast-item">
        <h3>5. Azure Friday</h3>
        <p>Hosted by Microsoft experts, this series offers rapid-fire, focused video interviews and demos on new services and features within the Azure ecosystem. It's an indispensable resource for cloud professionals dedicated to the Microsoft platform.</p>
        <div class="embed-container">
            <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/show/5VZ8EozeEsAZCTej0zNT4P?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
    </div>` 
    },
    {
      title: 'Roadmap to Digital Success in 2026',
      category: 'Digital Transformation',
      summary: 'An essential guide...',
      imageUrl: 'assets/blog-thumbnails/neuralnetwork.webp',
      // Ensure the slug matches the URL path!
      slug: 'roadmap-to-digital-success-in-2026', 
      fullContent: `
        <p class="text-lg"><strong>Key strategic steps every business must take to accelerate digital maturity.</strong></p>
      <p>The pace of technological change shows no signs of slowing down. For businesses aiming to stay competitive in the coming year, a reactive stance is no longer sufficient. Digital transformation must be approached as a continuous journey guided by a clear, strategic roadmap. Successfully accelerating digital maturity by 2026 requires focused effort across three critical phases.</p>
    <h2>Phase 1: Foundational Assessment and Data Control</h2>
    <p>Before any major technology rollout, organizations must establish a solid, data-driven foundation. This phase ensures that the business is building on reliable information and processes.</p>
    <ul class="step-list">
        <li>
            <strong>Conduct a Digital Maturity Audit:</strong> Objectively assess the current state of infrastructure, employee skills, and process. Understand what data is used, by whom, how it is used and what the purpose is. This ecompasses all data flows, from internal processes to the customer.
        </li>
        <li>
            <strong>Apply Data Cleansing:</strong> We no longer need to worry about decentralised and scattered data, but we do need to ensure it is well organised and follows data quality principles.
        </li>
        <li>
            <strong>Establish Data Governance (DG):</strong> Implement clear policies for data quality, privacy, and access. Without trust in the data, digital efforts will fail.
        </li>
    </ul>
    <h2>Phase 2: Hyper-Automation and AI Integration</h2>
    <p>With a stable foundation, the focus shifts to leveraging advanced technologies to drive efficiency and create new value streams. This is where transformation moves from incremental change to exponential growth.</p>
    <ul class="step-list">
        <li>
            <strong>Prioritize Hyper-Automation:</strong> Identify high-volume, repetitive tasks across Finance, HR, and Operations suitable for Robotic Process Automation (RPA) and intelligent workflow automation.
        </li>
        <li>
            <strong>Integrate AI for Prediction:</strong> Deploy AI models for predictive analytics, forecasting demand, and predicting customer churn. Move beyond basic reporting to proactive, informed decision-making.
        </li>
        <li>
            <strong>Adopt Cloud-Native Practices:</strong> Embrace cloud automation to increase the speed and reliability of deploying new software and services, making IT development cycles agile and responsive.
        </li>
    </ul>

    <h2>Phase 3: Customer Experience (CX) Evolution</h2>
    <p>The final phase ensures that internal digital improvements translate directly into superior internal, customer and partner experiences. Ensuring your internal work processes are friction free will become a competitve necessity. Digital success is ultimately measured by market impact and operational effeciency.</p>

    <ul class="step-list">
        <li>
            <strong>Create Unified Customer Journeys:</strong> Break down internal departmental silos to provide a seamless, omnichannel experience. The customer should feel they are interacting with one consistent brand, regardless of the touchpoint.
        </li>
        <li>
            <strong>Leverage Personalization Engines:</strong> Use the centralized data and AI models (from Phase 2) to deliver truly individualized marketing, product recommendations, and support interactions.
        </li>
        <li>
            <strong>Build a Culture of Continuous Digital Learning:</strong> Training is not a one-time event. Foster an organizational culture that constantly encourages skill acquisition and adaptation to new digital tools and methodologies.
        </li>
    </ul>

    <p class="mt-8 text-lg">By following this three-phase roadmap, businesses can ensure their digital transformation efforts are not just technology upgrades, but strategic investments that secure competitive advantage and drive sustainable growth well into 2026 and beyond.</p>
` 
    },
    {
      title: 'AI Driven Quality in Month End Reporting',
      category: 'Case Studies',
      summary: 'An essential guide...',
      imageUrl: 'assets/blog-thumbnails/blog_payments.webp',
      // Ensure the slug matches the URL path!
      slug: 'ai-driven-quality-in-month-end-reporting', 
      fullContent: `<p class="text-lg"><strong>How improving data quality in delegated authority reporting unlocked new regulatory reporting capabilities and operational efficiency.</strong></p>
  
    <p>In the delegated authority space, the accuracy of MonthEnd Bordereaux reports—detailed spreadsheets of premiums and claims shared between Managing General Agents (MGAs) and carriers is paramount. Historically, this has been an administrative nightmare, with compliance, reserving, and financial reporting resting on the integrity of often poorly structured data received via spreadsheets and Excel. This case study explores how intelligent automation transformed this critical process.</p>

    <h2>The Bordereaux Challenge: Manual Pain and Compliance Risk</h2>

    <p>The bordereaux process is plagued by a "garbage in, garbage out" problem. Carriers receive hundreds of reports monthly, each presenting unique data quality challenges:</p>
    
    <ul class="step-list">
        <li><strong>Format and Mapping Inconsistencies:</strong> Every MGA uses a slightly different template, requiring extensive manual mapping and reconciliation before data can be ingested by core systems.</li>
        <li><strong>Delayed Reconciliation:</strong> Errors are often only caught weeks or months after submission, leading to inaccurate reserving and regulatory submissions.</li>
        <li><strong>High Operational Cost:</strong> Teams dedicate hundreds of hours monthly simply cleaning, correcting, and chasing missing information, diverting resources from analysis and strategy. </li>
    </ul>

    <h2>The Solution: AI as the Bordereaux Quality Engine</h2>

    <p>Implementing an Artificial Intelligence (AI) and Machine Learning (ML) solution allowed the carrier to stop treating bordereaux as simple files and start treating them as structured data streams. The AI platform was specifically trained to handle the variability inherent in delegated authority reporting, bridging the gap between external formats and internal data standards.</p>

    <ul class="step-list">
        <li>
            <strong>Intelligent Data Ingestion:</strong> AI models were deployed to automatically "read" and interpret incoming MGA spreadsheets, regardless of template variations. The system identified column headers, extracted data types (even from merged cells), and normalized policy and claims information into a clean, unified data lake structure instantly.
        </li>
        <li>
            <strong>PreIngestion Validation (External & Internal):</strong> The AI platform cross-referenced key fields (e.g., policy numbers, client IDs, property addresses) against internal policy records and reliable third-party data sources. This automated verification drastically improved data accuracy at the point of entry, significantly reducing fraud potential and ensuring coverage limits were correctly tracked.
        </li>
        <li>
            <strong>Automated Root Cause Identification:</strong> The ML component moved beyond simple error flagging. It analyzed recurring errors across submissions, identifying the root cause—for instance, a specific MGA team repeatedly misclassifying premium types. This allowed the carrier to provide targeted feedback to partners, preventing future quality issues from occurring in the first place.
        </li>
    </ul>

    <h2>Outcome: Unlocking Trust and Regulatory Agility</h2>

    <p>The transformation delivered quantifiable operational and compliance benefits:</p>

    <ul class="step-list">
        <li><strong>95% Reduction in Manual Processing Time:</strong> The monthly bordereaux reconciliation cycle dropped from 10 days to less than half a day.</li>
        <li><strong>Instant Regulatory Readiness:</strong> With clean, verified data available in a structured format, regulatory reports were generated automatically and validated against internal policies instantly, providing the highest level of assurance to regulatory bodies.</li>
        <li><strong>Enhanced Partner Relations:</strong> The AI tool generated transparent, actionable data quality reports for MGAs, fostering collaborative improvement rather than punitive audits.</li>
    </ul>

    <p class="mt-8 text-lg">By adopting AI to handle the heavy lifting of bordereaux data quality, the insurance carrier transformed a compliance burden into a competitive advantage, securing a trustworthy data foundation for reserving, reinsurance, and advanced risk modeling.</p>` 
    },
    {
      title: 'The future of Price Comparision sites: Will AI take over?',
      category: 'AI & Automation',
      summary: 'How consumer purchasing habits in an AI-driven world are challenging comparison marketplaces.',
      imageUrl: 'assets/blog-thumbnails/pcw_aifuture.webp',
      // Ensure the slug matches the URL path!
      slug: 'the-future-of-price-comparision-sites-will-ai-take-over', 
      fullContent: `<p class="text-lg"><strong>How shifting consumer purchasing habits in an AI-driven world are challenging the traditional advertising and operating models of comparison marketplaces.</strong></p>
    <p>Price Comparison Websites (PCWs) revolutionized consumer purchasing by putting pricing power directly into the hands of the customer. However, in the age of Artificial Intelligence, this model faces an existential threat not just from competing technologies, but from fundamental shifts in how customers interact with brands and media. The question is no longer about better search algorithms, but whether the PCW model itself can survive the dual forces of AI suggestion and fractured attention.</p>
    <h2>The AI Recommendation Engine vs. The Trust Barrier</h2>
    <p>AI assistants and large language models (LLMs) are rapidly integrating into the purchase funnel. When a customer needs to buy complex products like car insurance or a mortgage, AI can now efficiently suggest optimal providers based on a deep, real-time understanding of the user's financial profile and risk appetite.</p>
    <ul class="step-list">
        <li>
            <strong>AI's Suggestive Power:</strong> AI can compile and compare policy details faster than any PCW interface, presenting the "best" options in a conversational format tailored to the user's needs. 
        </li>
        <li>
            <strong>The Trust Gap:</strong> Despite AI's efficiency, it cannot yet be trusted to choose for us, especially for high-stakes, legally binding products like insurance. The final responsibility for a policy's suitability rests with the individual.
        </li>
        <li>
            <strong>The Human Verification Loop:</strong> Customers know that a subtle difference in a policy's excess or coverage clauses can have massive financial consequences. Therefore, humans will still need to verify all the information presented by AI, ensuring the recommendation aligns with their full, often nuanced, requirements. PCWs must evolve to be the place where this final human verification happens.
        </li>
    </ul>
    <h2>The Greater Challenge: Fractured Consumer Attention</h2>

    <p>While AI poses a functional threat, a greater, more immediate challenge to PCWs comes from rapidly changing customer habits and the erosion of traditional media channels.</p>

    <ul class="step-list">
        <li>
            <strong>The Decline of Broadcast Reach:</strong> Price comparison sites built their brands on massive, memorable television campaigns. Today, with many people not watching television or opting for ad-free streaming, this primary channel for mass customer acquisition is failing.
        </li>
        <li>
            <strong>Hyper-Competitive Digital Advertising:</strong> Advertising spend is shifting to fragmented digital spaces—social media, micro-communities, and niche streaming platforms. In this competitive market, the cost of acquiring a customer (CAC) via targeted digital advertising is higher than ever, squeezing the already tight margins of PCWs.
        </li>
        <li>
            <strong>Brand Trust Through Content:</strong> Customers are turning to trusted influencers, specialized content creators, and subscription newsletters for product advice, bypassing the broad, transactional interfaces of PCWs entirely.
        </li>
    </ul>

    <h2>The Future Role: From Aggregator to Advisor</h2>

    <p>To survive this dual pressure, price comparison sites cannot remain simple transaction aggregators. Their future lies in embracing a new role centered on expertise and trust.</p>

    <ul class="step-list">
        <li><strong>Become Trust Brokers:</strong> PCWs must pivot from being a list of prices to being a certified validator of complex policies, providing an authoritative, human-verified layer atop AI suggestions.</li>
        <li><strong>Offer Specialization:</strong> Instead of listing dozens of products poorly, PCWs could succeed by focusing on niche, complex financial products that require deep, human-guided advice.</li>
        <li><strong>Adopt Content-Driven Acquisition:</strong> They must shift advertising budgets from broadcast ads to producing high-value educational content and tools that capture customer attention in their preferred digital spaces.</li>
    </ul>

    <p class="mt-8 text-lg">Ultimately, AI will not *take over* price comparison; it will transform it. PCWs that adapt to facilitate the inevitable human verification loop, while solving their distribution challenge in a fractured media landscape, will secure their place in the consumer's purchasing journey of the future.</p>
` 
    },
    // ... Add all your other articles here with unique slugs ...
  ];
  // -------------------------------------------------------------

  private platformId = inject(PLATFORM_ID);
  
  // Method to get the sanitizer instance (Node-safe)
  getDomPurifyInstance() {
    // If running in the browser, use the global DOMPurify if it exists
    if (isPlatformBrowser(this.platformId) && (window as any).DOMPurify) {
        return (window as any).DOMPurify;
    }
    
    // If running on the server, try to initialize the instance once
    if (!isPlatformBrowser(this.platformId) && !domPurifyInstance) {
        try {

        } catch (e) {
           
        }
    }
    
    // For this specific error, let's use the simplest SSR-safe solution:
    return domPurifyInstance; // or fallback to a standard sanitizer if needed
  }
  /**
   * Finds the article data based on the URL slug.
   * @param slug The article slug from the URL.
   */
  fetchArticleData(slug: string): void {
    const foundArticle = this.mockArticles.find(a => this.formatSlug(a.title) === slug);
    
    
if (foundArticle) {
    this.seoService.generateTags(foundArticle);
    let sanitizedHtmlString: string;

    if (isPlatformBrowser(this.platformId)) {
      // Browser: safe to use window
      if ((window as any).DOMPurify) {
        sanitizedHtmlString = (window as any).DOMPurify.sanitize(foundArticle.fullContent as string);
      } else {
        sanitizedHtmlString = foundArticle.fullContent as string;
      }
    } else {
      // Server: avoid window, use fallback or skip sanitisation
      sanitizedHtmlString = foundArticle.fullContent as string;
    }


        const safeContent = this.sanitizer.bypassSecurityTrustHtml(sanitizedHtmlString);

        this.article = {
            ...foundArticle,
            fullContent: safeContent // Assign the safe content
        };
    } else {
      console.error('Article not found for slug:', slug);
    }
  }

  // Helper function to ensure consistency between your link slugs and your data slugs
  private formatSlug(title: string): string {
    return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
  }
}
