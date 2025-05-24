interface RichTextPreviewProps {
  content: string
}

export function RichTextPreview({ content }: RichTextPreviewProps) {
  return (
    <div 
      className="rich-text-editor"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
} 