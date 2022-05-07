import React, { useEffect, useRef, useState } from "react";
import Moment from 'react-moment';

export interface TableOfContentsProps {
  headers: any[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = (props) => {
  const { headers } = props;
  const [activeId, setActiveId] = useState();

  const headerElementsRef = useRef({});

  useEffect(() => {
    if (!headers || headers.length === 0) return;

    const callback = (headings) => {
      headerElementsRef.current = headings.reduce((map, headerElement) => {
        map[headerElement.target.id] = headerElement;
        return map;
      }, headerElementsRef.current);

      const visibleHeaders = [];
      Object.keys(headerElementsRef.current).forEach((key) => {
        const headerElement = headerElementsRef.current[key];
        if (headerElement.isIntersecting)
          visibleHeaders.push(headerElement);
      });
      const getIndexFromId = (id) =>
        headerElements.findIndex((header) => header.id === id);

      if (visibleHeaders.length === 1) {
        setActiveId(visibleHeaders[0].target.id);
      } else if (visibleHeaders.length > 1) {
        const sortedVisibleHeaders = visibleHeaders.sort(
          (a, b) => getIndexFromId(a.target.id) - getIndexFromId(b.target.id)
        );
        setActiveId(sortedVisibleHeaders[0].target.id);
      }
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: '-80px 0px -40% 0px',
    });

    const headerElements = Array.from(document.querySelectorAll(".scrollable-header"));
    headerElements.forEach((element) => observer.observe(element));

    return () => { headerElementsRef.current = {}; observer.disconnect(); }
  }, [headers, setActiveId]);

  const headClicked = (e, id: string) => {
    e.preventDefault();
    document.querySelector(`#${id}`).scrollIntoView({ behavior: 'smooth' });
  }

  const buildHeader = () => (
    <ul>
      {headers.map(h => {
        const headerId = `gm-${h.id}`;
        return (
          <li key={h.id} className={`${headerId === activeId ? "is-current" : "is-normal"} level-1`}>
            <div>
              <div></div>
              <a href={`#${h.group}`} onClick={e => headClicked(e, headerId)}>{h.group}</a>
            </div>
            {h.moments.length > 0 && (
              <ul>
                {h.moments.map(m => {
                  const l2HeaderId = `m-${m.id}`;
                  return (
                    <li key={m.id} className={`${l2HeaderId === activeId ? "is-current" : "is-normal"} level-2`}>
                      <div>
                        <div></div>
                        <a onClick={e => headClicked(e, l2HeaderId)}><Moment format="ddd MMM DD">{m.takePlaceAtDateTime}</Moment></a>
                      </div>
                    </li>);
                })}
              </ul>
            )}
          </li>
        )
      })
      }
    </ul>
  );

  return (
    <nav aria-label="Table of contents" className="toc">
      {headers && buildHeader()}
    </nav>
  )
}