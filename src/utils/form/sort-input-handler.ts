import Sortable from 'sortablejs';

document.addEventListener('DOMContentLoaded', (event) => {
  new Sortable(document.getElementById('sortable-list'), {
    filter: '.filtered',
    animation: 300,
    direction: 'vertical',
    ghostClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
  });
});
