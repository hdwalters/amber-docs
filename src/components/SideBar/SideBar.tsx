'use client'

import React from 'react'
import { Island } from '@/components/Island'
import { Text } from '@/components/Text'
import style from './SideBar.module.css'
import { getTableOfContents } from '@/utils/docs'
import Link from 'next/link'
import useSidebar from '@/contexts/DocumentContext/useSidebar'

interface Props {
    headers: string[],
    isFixed?: boolean
}

type Header = {
    level: number,
    title: string,
    relation: string,
    distance: number
}

function getHeaderLevel(header: string): number {
    const matches = header.match(/^#+\s/)
    return matches![0].length - 1
}

function getRelation(level: number, prevLevel: number): string {
    switch (level - prevLevel) {
        case 1:
            return 'child'
        case 0:
            return 'sibling'
        default:
            return 'detached'
    }
}

function getHeaders(headers: string[]): Header[] {
    let distances = [0, 0, 0]
    let prevLevel = NaN
    return headers.map(header => {
        const level = getHeaderLevel(header) - 1
        const relation = getRelation(level, prevLevel)
        const distance = distances[level]
        for (const i of distances.keys()) {
            if (i < level) distances[i]++
            else if (i >= level) distances[i] = 0
        }
        prevLevel = level
        return {
            level,
            title: header.replace(/^#+\s/, ''),
            relation,
            distance
        }
    })
}

export default function SideBar({ headers, isFixed = false }: Props) {
    const topics = getTableOfContents()
    const { isOpen } = useSidebar()
    const formattedHeaders = getHeaders(headers)

    const getHeaderLink = (header: string) => {
        return ['#', header.toLowerCase().replace(/[^\w]+/g, '-')].join('')
    }

    return (
        <div className={`${isFixed && style.fixed} ${isOpen && style.open}`}>
            <div className={`${style.container}`}>
                {headers.length > 0 && (
                    <Island label="On this page">
                        <div className={style.links}>
                            {formattedHeaders.map(({ level, title, relation, distance }) => (
                                <Link href={getHeaderLink(title)} key={title}>
                                    <Text block>
                                        <div className={style.indent} {...{ indent: level, relation }} style={{ '--distance': distance.toString()} as any}>
                                            <div className={style.text}>
                                                {title}
                                            </div>
                                        </div>
                                    </Text>
                                </Link>
                            ))}
                        </div>
                    </Island>
                )}
                <div className={style.spacer}/>
                <Island label="Table of contents">
                    <div className={style.links}>
                        {topics.map(({ path, title }) => (
                            <Link href={path} key={path}><Text block>{title}</Text></Link>
                        ))}
                    </div>
                </Island>
            </div>
        </div>
    )
}