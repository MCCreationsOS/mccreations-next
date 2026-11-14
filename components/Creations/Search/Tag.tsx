import styles from './SearchBar.module.css'

export default function Tag({tag, tagValue, includeTags, excludeTags, toggleTag}: {tag: string, tagValue: string, includeTags: string[], excludeTags: string[], toggleTag: (tagValue: string) => void}) {
    return (
        <button className={`${styles.tag} ${(includeTags.includes(tagValue)) ? styles.include : ""} ${(excludeTags.includes(tagValue)) ? styles.exclude : ""}`} onClick={() => toggleTag(tagValue)}>
            {tag}
        </button>
    )
}