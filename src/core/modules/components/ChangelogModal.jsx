import React, { memo } from 'react';

export default memo(props => {
  useEffect(() => {
    const getSource = async () => {
      const md = await readFile(source, 'utf-8');
      // For Vizality Changelog
      setMarkdown(md.replace(/{(fixed|added|improved|progress)( marginTop)?}/g, '').replace(/(# Changelog)/, '').trim());
    };

    if (existsSync(source)) {
      getSource();
    } else {
      setMarkdown(source.trim());
    }
  }, [ markdown ]);

  return (
    
  );
});
