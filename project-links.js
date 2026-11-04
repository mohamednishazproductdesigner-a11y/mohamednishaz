// Paste each project's destination URL here when it is ready.
// Empty entries keep the card display-only. Configured links open in a new tab.
const projectLinks={
  'lumen':'case-studies/lumen.html',
  'amazon-review':'case-studies/amazon-review.html',
};
document.querySelectorAll('[data-project]').forEach(card=>{
  const url=projectLinks[card.dataset.project]?.trim();
  if(!url)return;
  card.href=url;
  if(card.target==='_blank')card.setAttribute('aria-label',`${card.getAttribute('aria-label')} (opens in a new tab)`);
});
