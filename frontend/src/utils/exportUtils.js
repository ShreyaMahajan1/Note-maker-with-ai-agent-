// Export utilities for notes

export const exportToJSON = (notes) => {
  const dataStr = JSON.stringify(notes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mindsync-notes-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (notes) => {
  const headers = ['ID', 'Content', 'Category', 'Created At', 'Link'];
  const rows = notes.map(note => [
    note.id || '',
    `"${(note.content || '').replace(/"/g, '""')}"`,
    note.category || 'General',
    new Date(note.createdAt).toLocaleString(),
    note.link || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mindsync-notes-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToMarkdown = (notes) => {
  const markdown = notes.map(note => {
    const date = new Date(note.createdAt).toLocaleDateString();
    const category = note.category || 'General';
    const link = note.link ? `\n\n🔗 [Link](${note.link})` : '';
    
    return `## ${category} - ${date}\n\n${note.content}${link}\n\n---\n`;
  }).join('\n');

  const content = `# MindSync Notes Export\n\nExported on: ${new Date().toLocaleString()}\n\n${markdown}`;

  const dataBlob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mindsync-notes-${new Date().toISOString().split('T')[0]}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToText = (notes) => {
  const text = notes.map(note => {
    const date = new Date(note.createdAt).toLocaleString();
    const category = note.category || 'General';
    const link = note.link ? `\nLink: ${note.link}` : '';
    
    return `[${category}] ${date}\n${note.content}${link}\n\n${'='.repeat(50)}\n`;
  }).join('\n');

  const content = `MindSync Notes Export\nExported on: ${new Date().toLocaleString()}\n\n${'='.repeat(50)}\n\n${text}`;

  const dataBlob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mindsync-notes-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
