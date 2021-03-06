import './MarkDownContent.scss'
import style from './MarkDownContent.module.css'
import React from 'react';
import {Layout} from "../../General/Layout/Layout"
import {SideBar} from "../SideBar/SideBar"
import { FaGithub, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { WIP } from '../../General/WIP/WIP';
import { Link } from 'gatsby';

interface MarkdownContentProps {
    data: any
    location: string
    navigation: any,
    numbers: boolean
}


const NavigateForward: React.FunctionComponent<any> = ({ item }) => {
    return item.slug ? <div className={style.nextItem}>
        <Link to={item.slug}>{item.title}</Link>
        <FaArrowRight />
    </div> : null
}

const NavigateBack: React.FunctionComponent<any> = ({ item }) => {
    return item.slug ? <div className={style.previousItem}>
        <FaArrowLeft />
        <Link to={item.slug}>{item.title}</Link>
    </div> : null
}

const VersionChanged: React.FunctionComponent<{ action: 'Added' | 'Removed' | 'Deprecated', version: number }> = ({ action, version}) => {
    return <div className={style.versionchanged}>
        {action} in version {version}
    </div>
}

export const MarkdownContent: React.FunctionComponent<MarkdownContentProps> = ({ numbers = false, data, location, navigation }) => {
    const { html } = data.markdownRemark
    const { title, description, wip, addedInVersion, deprecatedInVersion, removedInVersion } = data.markdownRemark.frontmatter
    const { githubLink } = data.markdownRemark.fields

    let previousItem = null
    let nextItem = null
    const pathsnames = location.pathname.split('/')
    const subItems = navigation[pathsnames[2]]
    if (subItems) {
        const items = Object.keys(subItems).filter(s => s !== 'order').sort((a, b) => {
            if (subItems[a].slug && subItems[a].slug.includes('blog')) {
                return subItems[b].order - subItems[a].order
            }
            return subItems[a].order - subItems[b].order
        })
        const index = items.indexOf(pathsnames[3])
        if (index > 0) {
            previousItem = subItems[items[index - 1]]
        }
        if (index < items.length - 1) {
            nextItem = subItems[items[index + 1]]
        }
    }

    return <Layout location={location} hasSideBar={true}>
        <div className={style.wrapper}>
            <article className={style.article}>
                <header className={style.header}>
                    <h1 className={style.title}>
                        {title}
                        <a className={style.githubEdit} href={githubLink}><FaGithub /></a>
                    </h1>
                    {description && <h3 className={style.description}>{description}</h3>}
                    {wip && <WIP gitHubLink={githubLink} />}
                    {addedInVersion && <VersionChanged action="Added" version="5" />}
                    {deprecatedInVersion && <VersionChanged action="Deprecated" version="5" />}
                    {removedInVersion && <VersionChanged action="Removed" version="5" />}
                </header>
                <div
                    className={`${style.content} content`}
                    dangerouslySetInnerHTML={{__html: html}}
                />
                <footer>
                    <div> 
                        {previousItem && <NavigateBack item={previousItem} />}
                        {nextItem && <NavigateForward item={nextItem} />}
                    </div>
                </footer>
            </article>
            <SideBar numbers={numbers} navigation={navigation} currentLocation={location} />
        </div>
    </Layout>
}

export default MarkdownContent
