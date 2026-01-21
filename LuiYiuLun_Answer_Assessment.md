Question 1: The Hydration Error (10 points)
Scenario: Your Next.js app shows this error in the console:

Hydration failed because the initial UI does not match what was rendered on the server

Question 1: What are 3 common causes of this error?
Answer: 1. Invalid HTML structure or nested tag errors: For example, a p containing a div, a div inside a td, a table missing a tbody, or li elements nested directly within each other, etc.
        2. Using browser-only APIs like window and localStorage in SSR rendering, or using typeof window !== 'undefined' for conditional rendering, can cause the initial HTML to differ between the server and client.
        3. Third-party packages that dynamically manipulate the DOM during the initial render/hydration phase (such as certain sliders, breakpoint hooks, Grammarly, password managers, or Dark Reader browser extensions) can also cause inconsistent HTML structure.

Question 2: How would you debug this? (Name 2-3 specific steps)
Answer: 
1. Carefully compare the rendered HTML markup on the server versus the client, for example using React DevTools or by viewing "View Source" and inspecting the Elements tab, to find mismatches.
2. Use conditional logging (e.g. console.log) to check the values and rendering on both the server and client for components that use browser-specific APIs or behave differently on the server.

Question 2: Memory Leak Fix (10 points)
Scenario: This component causes memory leaks:

Identify the memory leak issues (there are 2):

Answer:
1. The setInterval in useEffect is missing a cleanup. If we don’t clear it when the component unmounts, it keeps running in the background and can waste memory.
2. The WebSocket event handler might still try to update the state after the component has unmounted, since we only close the connection but don’t properly prevent updates or clean up the event handler.

Provide the fixed code:
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('wss://api.example.com/notifications');
    let isMounted = true; // using the boolean to control the mount

    ws.onmessage = (event) => {
      if (isMounted) {
        setNotifications(prev => [...prev, JSON.parse(event.data)]);
      }
    };

    const interval = setInterval(() => {
      fetch('/api/analytics').then(r => r.json()).then(console.log);
    }, 5000);

    return () => {
      isMounted = false; // Prevent setting state after unmount
      ws.close();
      clearInterval(interval); // Clear the interval to avoid memory leak
    };
  }, []);

  return (
    <div>
      {notifications.map(n => <NotificationCard key={n.id} data={n} />)}
    </div>
  );
};

Question 3: Handling Unrealistic Deadlines (10 points)
Scenario: Your PM asks you to build these features in 2 weeks (you're the only frontend dev):

。User authentication
。Payment integration (Stripe)
。Admin dashboard
。Email notifications
。File uploads

Answer: 
1. There are five distinct features, each varying in complexity. The larger and more critical features—such as User Authentication, Payment Integration, and Admin Dashboard would each require at least one week to implement properly. These features are core to the application and involve security concerns, so it’s important to allocate enough time to build and thoroughly test them.

2. If I were required to deliver within 2 weeks, I would prioritize User Authentication, Payment Integration, and File Uploads. User Authentication is essential for security, ensuring only authorized users can access the application. Payment Integration is critical as it directly enables financial transactions—the core functionality of the system. File Uploads support documenting and managing payment-related files, which are likely important for transaction records. Focusing on these three features first ensures the application provides its fundamental value securely and efficiently.

3. If the deadline could be made more flexible, I would recommend a minimum of six weeks (one and a half months) to deliver these features with acceptable quality, testing, and reliability. This timeline takes into account the complexity of the requirements and allows for adequate planning, implementation, and review.

Question 4: Refactoring Decision
Answer:
1. Depending on the urgency of the situation, if so, building the new system will be the priority. If not, I will prioritize refactoring the entire project to ensure the system can be maintained more quickly.
2. I would refactor the nextjs version to be more latest version. Because the version 12 of nextjs have some security problem which is still not fix. It will make some potential issue in the project.
3. I think if the project have not refactor, there are some potential issue would happen in the future. And the maintain/bug fixing time will have increase by those problem. Next, there are components which are not reusable components. It also increase the implement in the future.

Qusetion 5: API Integration
Answer:
1. I would make each API call on the client side with Next.js. I think the API design is for the client to integrate with the database or handle calculations by the server. If the endpoints are designed well, the client can fetch the correct results/data and place them in the right part of the integration process.
2. If the product service is using GraphQL to fetch data and the response time is too slow, I would review the content being fetched and see if there is any unnecessary data included. I would try to optimize the query to only request needed fields.
3. I would store authentication tokens (like JWTs) in HttpOnly cookies for security. For every API call, I would read the token from the cookie (whether on the client side or in server-side rendering/API routes) and send it with the request. I would also use refresh tokens to allow longer sessions while keeping the service authenticated and secure.

Question 6: Code Review Scenario
Answer:
1. I would request change and use the react hook form to rewrite the code. First, he has not test the new hook. That mean it can not fulfill many situations. Second, no document and only they understand it. That mean if they quit the company, the hook can not reuse by the new teammate. Finally, they say "External libraries are bloated, this is optimized for our needs." and add 50KB to bundle. There is some conflict in this situation. I think it is not the good options in the task.
2. "Add some comments and make the function be more readable", "Can you think another options without build the new one? E.g. Using the react-hook-form"
3. I think it also give more comment in each commit and do some easy brief before implenment. Maybe have better idea to handle this task.

