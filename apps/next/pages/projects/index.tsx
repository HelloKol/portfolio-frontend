import React, { useContext } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { Container, Grid, ImageTag, Main, ProjectFilter, Section, Seo } from '@/components';
import { Context } from '@/contexts/Context';
import { useWindowDimension } from '@/hooks';
import { useTheme } from '@/providers';
import { Project, SEO } from '@/types';
import { sanityClient } from '@/lib';
import { PROJECT_INDEX_LIST_QUERY, PROJECT_INDEX_QUERY } from '@/services/queries';
import styles from './styles.module.scss';

interface Page {
  page: {
    title: string;
    seo: SEO;
  };
  work: Project[];
}

export default function Projects({ page, work }: Page): JSX.Element | null {
  if (!page) return null;
  const { theme } = useTheme();
  const { projectFilterTag, setProjectFilterTag } = useContext(Context);
  const { isMobile, isMobileLarge, isTablet } = useWindowDimension();
  const { title, seo } = page;
  const isDarkMode = theme === 'dark-theme';

  const filteredData = work
    .filter(
      (item) =>
        item?.type &&
        item.type.some((type) => type.toLowerCase().includes(projectFilterTag.toLocaleLowerCase()))
    )
    .sort((a, b) => a.rank - b.rank);

  return (
    <>
      <Seo seo={seo} />

      <Main>
        <Section className={`${styles.section} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
          <Container isFluid={false}>
            <Grid>
              {title && (
                <h1 className={`${styles.title} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
                  {title}
                </h1>
              )}
              <div className={styles.filterWrap}>
                <div className={styles.projectView}>
                  <p>Change view</p>
                  <button className={`${styles.filterBtn} ${styles.activeFilterBtn}`} disabled>
                    Grid
                  </button>
                  <button className={`${styles.filterBtn} ${styles.inActiveFilterBtn}`} disabled>
                    List
                  </button>
                </div>

                <div className={styles.filterList}>
                  <p>Type</p>
                  <button
                    className={`${styles.filterBtn} ${projectFilterTag === '' && styles.activeFilterBtn}`}
                    onClick={() => setProjectFilterTag('')}
                  >
                    All
                  </button>
                  <button
                    className={`${styles.filterBtn} ${
                      projectFilterTag === 'design' && styles.activeFilterBtn
                    }`}
                    onClick={() => setProjectFilterTag('design')}
                  >
                    Design
                  </button>
                  <button
                    className={`${styles.filterBtn} ${projectFilterTag === 'web' && styles.activeFilterBtn}`}
                    onClick={() => setProjectFilterTag('web')}
                  >
                    Web
                  </button>
                </div>
              </div>
              {isMobile || isMobileLarge || isTablet ? (
                <ul className={styles.projectFeedMobile}>
                  {filteredData.map((item, index) => {
                    const { title, color, slug, tools, coverImage } = item;

                    return (
                      <Link key={index} href={`/projects/${slug.current}`} className={styles.projectItem}>
                        {coverImage && (
                          <div className={styles.thumbmailImage}>
                            <ImageTag
                              src={`${coverImage?.asset?.url}`}
                              alt="project Image"
                              layout="fill"
                              objectFit="cover"
                              quality={100}
                              blurDataURL={coverImage?.asset?.metadata?.lqip}
                            />
                          </div>
                        )}
                        <div className={styles.projectTitleWrap}>
                          {title && (
                            <h1
                              className={styles.projectTitle}
                              style={{
                                color: color.value
                              }}
                            >
                              {title}
                            </h1>
                          )}
                          <div className={styles.projectTags}>
                            {tools &&
                              tools.map((item, index) => {
                                return <p key={index}>{item}</p>;
                              })}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </ul>
              ) : (
                <ul className={styles.projectFeedDesktop}>
                  <Grid>
                    {filteredData.map((item: any, index: any) => {
                      const { title, color, slug, tools, coverImage } = item;

                      return (
                        <Link key={index} href={`/projects/${slug.current}`} className={styles.projectItem}>
                          {coverImage && (
                            <div className={styles.thumbmailImage}>
                              <div className={styles.overlay}>
                                <span>View project</span>
                              </div>
                              <ImageTag
                                src={`${coverImage?.asset?.url}`}
                                alt="project Image"
                                layout="fill"
                                objectFit="cover"
                                quality={100}
                                blurDataURL={coverImage?.asset?.metadata?.lqip}
                              />
                            </div>
                          )}
                          {title && (
                            <h1
                              className={styles.projectTitle}
                              style={{
                                color: color.value
                              }}
                            >
                              {title}
                            </h1>
                          )}
                        </Link>
                      );
                    })}
                  </Grid>
                </ul>
              )}
            </Grid>
          </Container>
        </Section>
      </Main>
      <ProjectFilter />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    let page = await sanityClient.fetch(PROJECT_INDEX_QUERY);

    let work = await sanityClient.fetch(PROJECT_INDEX_LIST_QUERY);

    // render the 404 if there is no page in cms
    if (!page)
      return {
        notFound: true
      };

    page = JSON.parse(JSON.stringify(page));
    work = JSON.parse(JSON.stringify(work));

    return {
      props: {
        page,
        work
      },
      revalidate: 30
    };
  } catch (err) {
    return {
      notFound: true
    };
  }
};