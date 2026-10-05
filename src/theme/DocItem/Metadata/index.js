import React from 'react';
import DocItemMetadata from '@theme-original/DocItem/Metadata';
import Head from '@docusaurus/Head';
import {useDoc} from '@docusaurus/plugin-content-docs/client';

export default function DocItemMetadataWrapper(props) {
  const {metadata} = useDoc();
  const isExcluded =
    metadata.permalink?.startsWith('/dsa') ||
    metadata.permalink?.startsWith('/career-prep');

  return (
    <>
      <DocItemMetadata {...props} />
      {isExcluded && (
        <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
      )}
    </>
  );
}
