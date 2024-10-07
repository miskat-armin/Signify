import { comment } from "@/constants/type";
import { Avatar, Card } from "react-native-paper";

export default function CommentCard({ comment }: { comment: comment }) {
  return (
    <Card>
      <Card.Title
        title={comment.user.username}
        subtitle={comment.comment}
        left={() => (
          <Avatar.Image size={24} source={{ uri: comment.user.avatar }} />
        )}
      />
    </Card>
  );
}
