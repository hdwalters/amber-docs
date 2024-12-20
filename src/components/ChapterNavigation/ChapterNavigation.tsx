'use client'

import React from 'react'
import style from './ChapterNavigation.module.css'
import { Text } from '../Text'
import { FlatDoc } from '@/utils/docs'
import Link from 'next/link'
import { generateUrl } from '@/utils/urls'
import useVersion from '@/contexts/VersionContext/useVersion'

interface Props {
    index: number,
    flatToc: FlatDoc[]
}

export default function ChapterNavigation({ index, flatToc }: Props) {
    const { version } = useVersion()
    const prev = flatToc[index - 1]
    const next = flatToc[index + 1]
    return (
        <div className={style.container}>
            <div className={`${style.part} ${style.left}`}>
                {prev && (
                    <>
                        <div className={`${style.reverse} ${style.icon}`}></div>
                        <Text>
                            <Link href={`/${generateUrl(version, prev.path)}`}>
                                <span className={style.text}>
                                    {prev.title}
                                </span>
                            </Link>
                        </Text>
                    </>
                )}
            </div>
            <div className={`${style.part} ${style.center} ${style['page-indicator']}`}>
                <Text>{index + 1}/{flatToc.length}</Text>
            </div>
            <div className={`${style.part} ${style.right}`}>
                {next && (
                    <>
                        <Text>
                            <Link href={`/${generateUrl(version, next.path)}`}>
                                <span className={style.text}>
                                    {next.title}
                                </span>
                            </Link>
                        </Text>
                        <div className={style.icon}></div>
                    </>
                )}
            </div>
        </div>
    )
}
