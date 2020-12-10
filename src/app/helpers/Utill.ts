export class Utill {
    public static stringToHTML(str: string): ChildNode {
        var parser = new DOMParser();
        var doc = parser.parseFromString(str, 'text/html');
        return doc.body.firstChild;
    }
} 