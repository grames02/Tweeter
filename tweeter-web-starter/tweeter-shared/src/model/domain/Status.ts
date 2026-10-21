import { PostSegment, Type } from "./PostSegment";
import { User } from "./User";
import { format } from "date-fns";

export class Status {
  private _status: string;
  private _user: User;
  private _timestamp: number;
  private _segments: PostSegment[];

  public constructor(status: string, user: User, timestamp: number) {
    this._status = status;
    this._user = user;
    this._timestamp = timestamp;
    this._segments = this.getStatusSegments(status);
  }

  private getStatusSegments(status: string): PostSegment[] {
    const segments: PostSegment[] = [];

    let startIndex = 0;

    for (let reference of Status.getSortedReferences(status)) {
      if (startIndex < reference.startPostion) {
        segments.push(
          new PostSegment(
            status.substring(startIndex, reference.startPostion),
            startIndex,
            reference.startPostion - 1,
            Type.text,
          ),
        );
      }

      segments.push(reference);

      startIndex = reference.endPosition;
    }

    if (startIndex < status.length) {
      segments.push(
        new PostSegment(
          status.substring(startIndex),
          startIndex,
          status.length,
          Type.text,
        ),
      );
    }

    return segments;
  }

  private static getSortedReferences(status: string): PostSegment[] {
    const references = [
      ...Status.parseUrlReferences(status),
      ...Status.parseMentionReferences(status),
      ...Status.parseNewlines(status),
    ];

    references.sort((a, b) => {
      return a.startPostion - b.startPostion;
    });

    return references;
  }

  private static parseUrlReferences(status: string): PostSegment[] {
    return this.parseReferences(
      status,
      (status: string) => {
        return Status.parseUrls(status);
      },
      Type.url,
    );
  }

  private static parseReferences(
    status: string,
    parseMethod: (status: string) => string[],
    type: Type,
  ): PostSegment[] {
    const references: PostSegment[] = [];

    const referenceStrings: string[] = parseMethod(status);

    let previousStartIndex = 0;

    for (let ref of referenceStrings) {
      let startIndex = status.indexOf(ref, previousStartIndex);

      if (startIndex > -1) {
        // Push the reference
        references.push(
          new PostSegment(ref, startIndex, startIndex + ref.length, type),
        );

        // Move start and previous start past the reference
        startIndex = startIndex + ref.length;
        previousStartIndex = startIndex;
      }
    }

    return references;
  }

  private static parseUrls(status: string): string[] {
    const urlRegex: RegExp = /https?:\/\/[^\s<>"']+[a-zA-Z0-9]/g;
    return this.parseRegex(status, urlRegex);
  }

  private static parseRegex(status: string, regex: RegExp): string[] {
    const regexMatches: string[] = [];
    const matches: RegExpMatchArray | null = status.match(regex);

    if (matches) {
      for (let url of matches) {
        regexMatches.push(url);
      }
    }

    return regexMatches;
  }

  private static parseMentionReferences(status: string): PostSegment[] {
    return this.parseReferences(
      status,
      (status: string) => {
        return Status.parseMentions(status);
      },
      Type.alias,
    );
  }

  private static parseMentions(status: string): string[] {
    const aliasRegex: RegExp = /@[a-zA-Z0-9]+/g;
    return this.parseRegex(status, aliasRegex);
  }

  private static parseNewlines(status: string): PostSegment[] {
    const newlines: PostSegment[] = [];

    const regex = /\n/g;

    let match;
    while ((match = regex.exec(status)) !== null) {
      const matchIndex = match.index;
      newlines.push(
        new PostSegment("\n", matchIndex, matchIndex + 1, Type.newline),
      );
    }

    return newlines;
  }

  public get status(): string {
    return this._status;
  }

  public set status(value: string) {
    this._status = value;
  }

  public get user(): User {
    return this._user;
  }

  public set user(value: User) {
    this._user = value;
  }

  public get timestamp(): number {
    return this._timestamp;
  }

  public get formattedDate(): string {
    let date: Date = new Date(this.timestamp);
    return format(date, "MMMM dd, yyyy HH:mm:ss");
  }

  public set timestamp(value: number) {
    this._timestamp = value;
  }

  public get segments(): PostSegment[] {
    return this._segments;
  }

  public set segments(value: PostSegment[]) {
    this._segments = value;
  }

  public equals(other: Status): boolean {
    return (
      this._user.equals(other.user) &&
      this._timestamp === other._timestamp &&
      this._status === other.status
    );
  }

  public static fromJson(json: string | null | undefined): Status | null {
    if (!!json) {
      const jsonObject: {
        _status: string;
        _user: {
          _firstName: string;
          _lastName: string;
          _alias: string;
          _imageUrl: string;
        };
        _timestamp: number;
        _segments: PostSegment[];
      } = JSON.parse(json);
      return new Status(
        jsonObject._status,
        new User(
          jsonObject._user._firstName,
          jsonObject._user._lastName,
          jsonObject._user._alias,
          jsonObject._user._imageUrl,
        ),
        jsonObject._timestamp,
      );
    } else {
      return null;
    }
  }

  public toJson(): string {
    return JSON.stringify(this);
  }
}
