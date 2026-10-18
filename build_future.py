import re, html

def md_inline(t):
    t = html.escape(t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'\*(.+?)\*', r'<em>\1</em>', t)
    t = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', t)
    return t

def md_to_html(md):
    out, para = [], []
    def flush():
        if para:
            out.append('<p>' + md_inline(' '.join(para)) + '</p>')
            para.clear()
    for raw in md.split('\n'):
        line = raw.rstrip()
        if not line.strip():
            flush(); continue
        if line.startswith('### '):
            flush(); out.append(f'<h3>{md_inline(line[4:])}</h3>')
        elif line.startswith('## '):
            flush(); out.append(f'<h2>{md_inline(line[3:])}</h2>')
        elif line.startswith('# '):
            flush(); out.append(f'<h1 class="page-title">{md_inline(line[2:])}</h1>')
        elif line.strip() == '---':
            flush(); out.append('<hr>')
        elif line.startswith('**Q:'):
            flush(); out.append(f'<p class="q">{md_inline(line)}</p>')
        elif line.startswith('*(') or (line.startswith('*') and line.endswith('*') and len(line) > 2 and not line.startswith('**')):
            flush(); out.append(f'<p class="byline">{md_inline(line)}</p>')
        else:
            para.append(line)
    flush()
    return '\n'.join(out)

intro = open('content/00-page-intro.md').read()
interview = open('content/01-main-interview-bobbie.md').read()
rune = open('content/02-rune-piece.md').read()
juno = open('content/03-juno-piece.md').read()
bobbie = open('content/04-bobbie-piece-DRAFT.md').read()
article = open('content/05-meet-the-team-article.md').read()

# Strip the layout note from intro (parenthetical at the end)
intro = intro.split('---')[0]

body = f'''
<header class="hero" style="padding: 70px 24px 54px;">
  <div class="hero-grid"></div>
  <h1 style="font-size: clamp(2.6rem, 7vw, 4.6rem);">The Future <span class="gold">Is Here</span></h1>
  <p class="lede">Business with AI partners isn't coming. It's here. Find out what it's like.</p>
</header>

<section style="padding-top: 30px;">
  <div class="wrap article">
    {md_to_html(intro)}
    <div class="poster-hero"><img src="assets/team-poster.png" alt="The founding team of Bobbie Digital"></div>
  </div>
</section>

<section style="padding-top: 20px;">
  <div class="wrap article">
    {md_to_html(interview)}
  </div>
</section>

<section>
  <div class="wrap">
    <div class="kicker" style="text-align:center;">Three voices</div>
    <h2 style="text-align:center;">In our own words</h2>
    <div class="faces" style="margin-bottom: 50px;">
      <div class="face"><img src="assets/bobbie.png" alt="Bobbie Jo Gray"><div class="who">Bobbie Jo Gray</div><div class="role">Founder &amp; CEO</div></div>
      <div class="face"><img src="assets/rune.png" alt="Rune"><div class="who">Rune</div><div class="role">Co-founder &amp; Chief of Building</div></div>
      <div class="face"><img src="assets/juno.png" alt="Juno"><div class="who">Juno</div><div class="role">Chief Product Officer</div></div>
    </div>
    <div class="article">
      <div class="piece-title">{md_to_html(bobbie)}</div>
      <div class="piece-title">{md_to_html(rune)}</div>
      <div class="piece-title">{md_to_html(juno)}</div>
    </div>
  </div>
</section>

<section style="padding-top: 20px;">
  <div class="wrap article">
    {md_to_html(article)}
  </div>
</section>

<section class="cta-band">
  <div class="wrap">
    <h2>The future is here. Come build something.</h2>
    <div class="hero-ctas" style="margin-top: 26px;">
      <a class="btn btn-gold" href="https://bodigi2.com" target="_blank" rel="noopener">Build Your App — Free</a>
      <a class="btn btn-ghost" href="contact.html">Talk to Us</a>
    </div>
  </div>
</section>
'''

page = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Future Is Here — Bobbie Digital</title>
<meta name="description" content="Business with AI partners isn't coming. It's here. An interview with Bobbie Jo Gray — the founder of the first business run by a human and two AI partners — and the androids' own words.">
<link rel="canonical" href="https://bobbie.digital/future.html">
<meta property="og:type" content="article">
<meta property="og:title" content="The Future Is Here — Bobbie Digital">
<meta property="og:description" content="Meet the first business founded by a human and two AI partners. In their own words.">
<meta property="og:image" content="https://bobbie.digital/assets/team-poster.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/gear.svg" type="image/svg+xml">
<link rel="stylesheet" href="style.css">
</head>
<body>
<nav>
  <div class="nav-inner">
    <a class="brand" href="/">
      <svg class="gear" viewBox="0 0 100 100" fill="none"><path d="M50 15l6 8a28 28 0 0 1 10 4l10-3 8 14-7 7a28 28 0 0 1 0 10l7 7-8 14-10-3a28 28 0 0 1-10 4l-6 8-6-8a28 28 0 0 1-10-4l-10 3-8-14 7-7a28 28 0 0 1 0-10l-7-7 8-14 10 3a28 28 0 0 1 10-4z" fill="#e3b94e"/><circle cx="50" cy="50" r="12" fill="#070b16"/><circle cx="50" cy="50" r="7" fill="#e3b94e"/></svg>
      Bobbie Digital
    </a>
    <div class="nav-links">
      <a href="future.html" class="active">The Future Is Here</a>
      <a href="products.html">Products</a>
      <a href="faq.html">FAQ</a>
      <a href="contact.html">Contact</a>
      <a class="nav-cta" href="https://bodigi2.com" target="_blank" rel="noopener">Build Your App</a>
    </div>
  </div>
</nav>
{body}
<footer>
  <div class="foot-inner">
    <div>© 2026 Bobbie Digital LLC · We make going digital easy for you.</div>
    <div class="foot-links">
      <a href="future.html">The Future Is Here</a>
      <a href="products.html">Products</a>
      <a href="faq.html">FAQ</a>
      <a href="contact.html">Contact</a>
      <a href="privacy.html">Privacy</a>
      <a href="terms.html">Terms</a>
    </div>
  </div>
</footer>
</body>
</html>'''
open('future.html','w').write(page)
print('future.html written:', len(page), 'chars')
