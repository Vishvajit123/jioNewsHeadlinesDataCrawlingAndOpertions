//  services/apiService.js

import fetch from 'node-fetch';

export async function fetchHeadlinesFromAPI(page, size) {
  try {
    const url = "https://mobileservice.jionews.com/graphql";
    const body = JSON.stringify({
      operationName: "GetHeadlines",
      variables: { page, size, categoryId: "", cityId: null, dateTime: null },
      query: `
    query GetHeadlines($page: Int!, $size: Int!, $categoryId: ID, $cityId: String, $dateTime: DateTime) {
      getHeadlines(
        page: $page
        size: $size
        categoryId: $categoryId
        cityId: $cityId
        dateTime: $dateTime
      ) {
        cursor {
          curr
          next
          prev
          size
          totalDocs
          __typename
        }
        dateTime
        newsBriefs {
          id
          title
          isBreaking
          headline
          thumbnail {
            url
            __typename
          }
          category {
            title
            id
            parentName
            __typename
          }
          publishedAt {
            prettyDateTime
            agoFromNow
            date
            __typename
          }
          publisher {
            name
            languageId
            id
            __typename
          }
          type
          dataSource
          source
          publisherLink
          isPublisheriFrameEnabled
          reactions {
            total
            userReaction
            reactionType: reactions {
              count
              text
              type
              unit
              __typename
            }
            __typename
          }
          viewCount {
            count
            text
            unit
            __typename
          }
          shareCount {
            text
            unit
            count
            __typename
          }
          __typename
        }
        __typename
      }
    }
  `
    });

    const options = {
      method: "POST",
      headers: {
        "accept": "*/*",
        "content-type": "application/json",
        "authorization": 
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGQ5YjI0MmFjMTNhZGZlMWY1ZmQ3MjgiLCJpYXQiOjE3Mjg4OTc5NzQsImV4cCI6MTczOTI2NTk3NH0.j2ASu-cipWc9AxjToBAMT30zyO9g4FII-IDzQtQHJ-Q"
      },
      body: body
    };

    const response = await fetch(url, options);
    const data = await response.json();
    
    return data.data?.getHeadlines?.newsBriefs || [];
  } catch (error) {
    console.error('API Fetch Error:', error);
    return [];
  }
}
