// seed.js
import mongoose from "mongoose";
import { mongoUri } from "./config.js";
import Chapter from "./modals/chapterSchema.js";
import Topic from "./modals/topicSchema.js";
import Problem from "./modals/problemSchema.js";
import dns from "node:dns";

dns.setServers(['8.8.8.8', '8.8.4.4']);

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🔌 Connected to MongoDB");

    // Optional: clear existing data (comment out if you want to keep old data)
    await Promise.all([
      Chapter.deleteMany({}),
      Topic.deleteMany({}),
      Problem.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing collections");

    // ---------- CHAPTERS ----------
    const chapterTitles = [
      "Arrays",
      "Strings",
      "Linked Lists",
      "Stacks & Queues",
      "Binary Search",
      "Trees",
      "Graphs",
      "Dynamic Programming",
    ];

    const chapters = await Chapter.insertMany(
      chapterTitles.map((title, idx) => ({
        title,
        order: idx + 1,
        description: "",
      }))
    );
    console.log(`📚 Created ${chapters.length} chapters`);
    const chapterMap = Object.fromEntries(
      chapters.map((c) => [c.title, c._id])
    );

    // ---------- TOPICS & PROBLEMS ----------
    // Helper to insert a topic and return its _id
    const createTopic = async (chapterTitle, title, order) => {
      const topic = await Topic.create({
        chapterId: chapterMap[chapterTitle],
        title,
        order,
        description: "",
      });
      return topic;
    };

    // Helper to insert a problem
    const createProblem = async (topic, title, difficulty, urls) => {
      await Problem.create({
        topicId: topic._id,
        title,
        difficulty,
        youtubeUrl: urls?.youtubeUrl ?? null,
        practiceUrl: urls?.practiceUrl ?? null,
        articleUrl: urls?.articleUrl ?? null,
      });
    };

    // ----- Arrays -----
    const arrTwoPtr = await createTopic(
      "Arrays",
      "Two Pointers",
      1
    );
    await createProblem(arrTwoPtr, "Two Sum", "Easy", {
      youtubeUrl: "https://www.youtube.com/watch?v=KLlXCFG5TnA",
      practiceUrl: "https://leetcode.com/problems/two-sum/",
      articleUrl: "https://www.geeksforgeeks.org/two-sum/",
    });
    await createProblem(arrTwoPtr, "3Sum", "Medium", {
      youtubeUrl: "https://www.youtube.com/watch?v=jzZsG8n2R9A",
      practiceUrl: "https://leetcode.com/problems/3sum/",
    });
    await createProblem(arrTwoPtr, "Container With Most Water", "Medium", {
      youtubeUrl: "https://www.youtube.com/watch?v=UuiTKBwPgAo",
      practiceUrl: "https://leetcode.com/problems/container-with-most-water/",
    });

    const arrSliding = await createTopic("Arrays", "Sliding Window", 2);
    await createProblem(
      arrSliding,
      "Maximum Subarray",
      "Easy",
      {
        youtubeUrl:
          "https://www.youtube.com/watch?v=2MmGZdiKR9Y",
        practiceUrl: "https://leetcode.com/problems/maximum-subarray/",
      }
    );
    await createProblem(
      arrSliding,
      "Longest Substring Without Repeating Characters",
      "Medium",
      {
        youtubeUrl:
          "https://www.youtube.com/watch?v=wi4mA7i6lTU",
        practiceUrl:
          "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      }
    );

    const arrPrefix = await createTopic(
      "Arrays",
      "Prefix Sum",
      3
    );
    await createProblem(
      arrPrefix,
      "Subarray Sum Equals K",
      "Medium",
      {
        youtubeUrl:
          "https://www.youtube.com/watch?v=fFVZt-6sgyo",
        practiceUrl: "https://leetcode.com/problems/subarray-sum-equals-k/",
      }
    );

    // ----- Strings -----
    const strBasic = await createTopic(
      "Strings",
      "Basic Manipulation",
      1
    );
    await createProblem(strBasic, "Valid Palindrome", "Easy", {
      youtubeUrl:
        "https://www.youtube.com/watch?v=vpenNJSY2ck",
      practiceUrl: "https://leetcode.com/problems/valid-palindrome/",
    });
    await createProblem(strBasic, "String Compression", "Medium", {
      youtubeUrl:
        "https://www.youtube.com/watch?v=4vKqWqxTqZc",
      practiceUrl: "https://leetcode.com/problems/string-compression/",
    });

    const strSearch = await createTopic(
      "Strings",
      "Substring Search",
      2
    );
    await createProblem(
      strSearch,
      "Implement strStr()",
      "Easy",
      {
        youtubeUrl:
          "https://www.youtube.com/watch?v=lXVy3Y0hQ9U",
        practiceUrl: "https://leetcode.com/problems/implement-strstr/",
      }
    );

    // ----- Linked Lists -----
    const llSingly = await createTopic(
      "Linked Lists",
      "Singly Linked List",
      1
    );
    await createProblem(
      llSingly,
      "Reverse Linked List",
      "Easy",
      {
        youtubeUrl:
          "https://www.youtube.com/watch?v=M0l46bFmJ8c",
        practiceUrl: "https://leetcode.com/problems/reverse-linked-list/",
      }
    );
    await createProblem(
      llSingly,
      "Merge Two Sorted Lists",
      "Easy",
      {
        youtubeUrl:
          "https://www.youtube.com/watch?v=PKtAufbYo8M",
        practiceUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
      }
    );

    const llCycle = await createTopic(
      "Linked Lists",
      "Cycle Detection",
      2
    );
    await createProblem(
      llCycle,
      "Linked List Cycle",
      "Easy",
      {
        youtubeUrl:
          "https://www.youtube.com/watch?v=rbYcB_kdKxU",
        practiceUrl: "https://leetcode.com/problems/linked-list-cycle/",
      }
    );

    // ----- Stacks & Queues -----
    const sqStack = await createTopic(
      "Stacks & Queues",
      "Stack Implementation",
      1
    );
    await createProblem(sqStack, "Implement Stack using Queues", "Easy", {
      youtubeUrl:
        "https://www.youtube.com/watch?v=WfOL7m4j6eM",
      practiceUrl: "https://leetcode.com/problems/implement-stack-using-queues/",
    });

    const sqQueue = await createTopic(
      "Stacks & Queues",
      "Queue Implementation",
      2
    );
    await createProblem(
      sqQueue,
      "Implement Queue using Stacks",
      "Easy",
      {
        youtubeUrl:
          "https://www.youtube.com/watch?v=VIz_AFDwc4M",
        practiceUrl: "https://leetcode.com/problems/implement-queue-using-stacks/",
      }
    );

    // ----- Binary Search -----
    const bsStd = await createTopic(
      "Binary Search",
      "Standard Binary Search",
      1
    );
    await createProblem(bsStd, "Binary Search", "Easy", {
      youtubeUrl:
        "https://www.youtube.com/watch?v=D5SrAga1pno",
      practiceUrl: "https://leetcode.com/problems/binary-search/",
    });
    await createProblem(bsStd, "Search Insert Position", "Easy", {
      youtubeUrl:
        "https://www.youtube.com/watch?v=Y7Chf4E7gWY",
      practiceUrl: "https://leetcode.com/problems/search-insert-position/",
    });

    const bsRotated = await createTopic(
      "Binary Search",
      "Search in Rotated Sorted Array",
      2
    );
    await createProblem(
      bsRotated,
      "Search in Rotated Sorted Array",
      "Medium",
      {
        youtubeUrl:
          "https://www.youtube.com/watch?v=U8XENwh8Oy8",
        practiceUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
      }
    );

    // ----- Trees -----
    const treeTrav = await createTopic(
      "Trees",
      "Binary Tree Traversal",
      1
    );
    await createProblem(
      treeTrav,
      "Binary Tree Inorder Traversal",
      "Easy",
      {
        youtubeUrl:
          "https://www.youtube.com/watch?v=f4IXB4z4Gjg",
        practiceUrl: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
      }
    );
    await createProblem(
      treeTrav,
      "Validate Binary Search Tree",
      "Medium",
      {
        youtubeUrl:
          "https://www.youtube.com/watch?v=Yt5jJsonEt8",
        practiceUrl: "https://leetcode.com/problems/validate-binary-search-tree/",
      }
    );

    const treeBST = await createTopic(
      "Trees",
      "Binary Search Tree Operations",
      2
    );
    await createProblem(
      treeBST,
      "Insert into a Binary Search Tree",
      "Medium",
      {
        youtubeUrl:
          "https://www.youtube.com/watch?v=_nBSk8yjkvA",
        practiceUrl: "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
      }
    );

    // ----- Graphs -----
    const graphRep = await createTopic(
      "Graphs",
      "Graph Representation",
      1
    );
    await createProblem(
      graphRep,
      "Number of Islands",
      "Medium",
      {
        youtubeUrl:
          "https://www.youtube.com/watch?v=pVfjYgkXj0c",
        practiceUrl: "https://leetcode.com/problems/number-of-islands/",
      }
    );

    const graphBFS = await createTopic(
      "Graphs",
      "BFS / DFS",
      2
    );
    await createProblem(
      graphBFS,
      "Clone Graph",
      "Medium",
      {
        youtubeUrl:
          "https://www.youtube.com/watch?v=Y1-qa5M2J9I",
        practiceUrl: "https://leetcode.com/problems/clone-graph/",
      }
    );

    // ----- Dynamic Programming -----
    const dp1D = await createTopic(
      "Dynamic Programming",
      "1D DP",
      1
    );
    await createProblem(dp1D, "Climbing Stairs", "Easy", {
      youtubeUrl:
        "https://www.youtube.com/watch?v=Y0lT9Fck7qI",
      practiceUrl: "https://leetcode.com/problems/climbing-stairs/",
    });
    await createProblem(dp1D, "House Robber", "Medium", {
      youtubeUrl:
        "https://www.youtube.com/watch?v=zggvDUufa6M",
      practiceUrl: "https://leetcode.com/problems/house-robber/",
    });

    const dp2D = await createTopic(
      "Dynamic Programming",
      "2D DP",
      2
    );
    await createProblem(
      dp2D,
      "Unique Paths",
      "Medium",
      {
        youtubeUrl:
          "https://www.youtube.com/watch?v=tWV A0Y3FGzM",
        practiceUrl: "https://leetcode.com/problems/unique-paths/",
      }
    );
    await createProblem(
      dp2D,
      "Edit Distance",
      "Hard",
      {
        youtubeUrl:
          "https://www.youtube.com/watch?v=We3YDTzNXEk",
        practiceUrl: "https://leetcode.com/problems/edit-distance/",
      }
    );

    console.log("✅ Seeding complete!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();